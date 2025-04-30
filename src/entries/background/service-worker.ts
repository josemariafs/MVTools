import browser from 'webextension-polyfill'

import { URLS } from '@/constants'
import { getPerformedUpgradeTasks, setMigratedFromVersion, setPerformedUpgradeTask, UPGRADE_TASKS } from '@/services/upgrades'
import { SCRIPT_FILES } from '@/types/content-script-assets'
import {
  DefaultEventListenerPayloadSchema,
  InjectDealScriptPayloadSchema,
  MESSAGE_TYPES,
  MigratedFromLocalStoragePayloadSchema
} from '@/types/event-messages'
import { initScriptFile, updatePopupBadge } from '@/utils/background'

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
    return true
  }

  const { type } = validMessage.data

  if (type === MESSAGE_TYPES.MIGRATED_FROM_LOCAL_STORAGE) {
    const { migrated } = MigratedFromLocalStoragePayloadSchema.parse(message)
    await setPerformedUpgradeTask(UPGRADE_TASKS.MIGRATED_FROM_LOCAL_STORAGE, migrated)
    updatePopupBadge({ pendingUpgrade: !migrated })
    return true
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Needed to explicitly check
  if (type === MESSAGE_TYPES.INJECT_DEAL_SCRIPT) {
    const { deal } = InjectDealScriptPayloadSchema.parse(message)
    const tab = await browser.tabs.create({ url: `${URLS.MEDIAVIDA}/foro/club-hucha/nuevo-hilo` })
    await initScriptFile({
      tabId: tab.id!,
      file: SCRIPT_FILES.FILL_NEW_DEAL_THREAD,
      args: { deal },
      debugMessage: 'Filling new deal thread'
    })
  }

  return true
})
