import browser from 'webextension-polyfill'

import { ALLOWED_URLS, URLS } from '@/constants'
import { getPerformedUpgradeTasks, setMigratedFromVersion, setPerformedUpgradeTask, UPGRADE_TASKS } from '@/services/upgrades'
import { SCRIPT_FILES } from '@/types/content-script-assets'
import {
  type Deal,
  type DealPayload,
  DefaultEventListenerPayloadSchema,
  MESSAGE_TYPES,
  MigratedFromLocalStoragePayloadSchema
} from '@/types/event-messages'
import { getActiveTab, initScriptFile, updatePopupBadge } from '@/utils/background'

browser.runtime.onInstalled.addListener(async ({ reason, previousVersion }) => {
  if (reason === 'update' && previousVersion) await setMigratedFromVersion(previousVersion)

  const upgradeTasks = await getPerformedUpgradeTasks()
  const pendingUpgrade = Object.values(upgradeTasks).some(task => !task)
  updatePopupBadge({ pendingUpgrade })

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
    await setPerformedUpgradeTask(UPGRADE_TASKS.MIGRATED_FROM_LOCAL_STORAGE, migrated)
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
