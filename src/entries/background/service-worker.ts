import browser from 'webextension-polyfill'

import { ALLOWED_URLS, URLS } from '@/constants'
import { DEFAULT_GLOBAL_CONFIG, getGlobalConfig, setGlobalConfig } from '@/services/config'
import { getPerformedUpgradeTasks, setMigratedFromVersion, setPerformedUpgradeTask, UPGRADE_TASK_IDS } from '@/services/upgrades'
import { SCRIPT_FILES } from '@/types/content-script-assets'
import {
  type Deal,
  type DealPayload,
  DefaultEventListenerPayloadSchema,
  MESSAGE_TYPES,
  MigratedFromLocalStoragePayloadSchema
} from '@/types/event-messages'
import { getActiveTab, initScriptFile, updatePopupBadge } from '@/utils/background'
import { devLog } from '@/utils/logging'

browser.runtime.onInstalled.addListener(async ({ reason, previousVersion }) => {
  if (reason === 'update' && previousVersion) await setMigratedFromVersion(previousVersion)

  const upgradeTasks = await getPerformedUpgradeTasks()
  const unfinishedTasks = upgradeTasks.filter(({ migrated }) => !migrated)
  const { manual = [], auto = [] } = Object.groupBy(unfinishedTasks, item => item.type)

  updatePopupBadge({ pendingUpgrade: Boolean(manual.length) })

  for (const task of auto) {
    if (task.id === UPGRADE_TASK_IDS.UPDATE_GLOBAL_CONFIG) {
      const globalConfig = await getGlobalConfig()
      const newConfig = {
        ...DEFAULT_GLOBAL_CONFIG,
        ...globalConfig
      }
      await setGlobalConfig(newConfig)
      await setPerformedUpgradeTask(UPGRADE_TASK_IDS.UPDATE_GLOBAL_CONFIG, true)
      devLog.log('Performed auto upgrade task', UPGRADE_TASK_IDS.UPDATE_GLOBAL_CONFIG, newConfig)
    }
  }

  console.debug(`Extension has been ${reason}ed`)
})

browser.runtime.onMessage.addListener(async message => {
  const validMessage = DefaultEventListenerPayloadSchema.safeParse(message)
  if (!validMessage.success) {
    console.error('Invalid message received:', message)
    return
  }

  const { type } = validMessage.data

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Needed to explicitly check
  if (type === MESSAGE_TYPES.MIGRATED_FROM_LOCAL_STORAGE) {
    const { migrated } = MigratedFromLocalStoragePayloadSchema.parse(message)
    await setPerformedUpgradeTask(UPGRADE_TASK_IDS.MIGRATED_FROM_LOCAL_STORAGE, migrated)
    updatePopupBadge({ pendingUpgrade: !migrated })
  }
})

chrome.webRequest.onErrorOccurred.addListener(
  async details => {
    const url = new URL(details.url)
    const finalLink = url.searchParams.get('url')
    if (!finalLink) {
      console.error('No link found in request:', details)
      return
    }

    const activeTab = await getActiveTab()
    const deal = await browser.tabs.sendMessage<DealPayload, Deal>(activeTab.id!, { type: MESSAGE_TYPES.DEAL })

    const newDealThreadTab = await browser.tabs.create({ url: `${URLS.MEDIAVIDA}/foro/club-hucha/nuevo-hilo` })
    await initScriptFile({
      tabId: newDealThreadTab.id!,
      file: SCRIPT_FILES.FILL_NEW_DEAL_THREAD,
      args: { deal: { ...deal, link: finalLink } },
      debugMessage: 'Filling new deal thread'
    })
  },
  { urls: [ALLOWED_URLS.CHOLLOMETRO_BACKEND] }
)
