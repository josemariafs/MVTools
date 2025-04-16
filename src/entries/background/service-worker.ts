import browser from 'webextension-polyfill'

import { getPerformedUpgradeTasks, setMigratedFromVersion } from '@/services/upgrades'
import { DefaultEventListenerPayloadSchema, MESSAGE_TYPES, MigratedFromLocalStoragePayloadSchema } from '@/types/event-messages'
import { updatePopupBadge } from '@/utils/browser-extension'

browser.runtime.onInstalled.addListener(async ({ reason, previousVersion }) => {
  if (reason === 'update' && previousVersion) await setMigratedFromVersion(previousVersion)

  const upgradeTasks = await getPerformedUpgradeTasks()
  const pendingUpgrade = Object.values(upgradeTasks).some(task => !task)
  updatePopupBadge({ pendingUpgrade })

  console.debug(`Extension has been ${reason}ed`)
})

browser.runtime.onMessage.addListener(message => {
  const validMessage = DefaultEventListenerPayloadSchema.safeParse(message)
  if (!validMessage.success) {
    console.error('Invalid message received:', message)
    return true
  }

  const { type } = validMessage.data

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Needed for the future
  if (type === MESSAGE_TYPES.MIGRATED_FROM_LOCAL_STORAGE) {
    const { migrated } = MigratedFromLocalStoragePayloadSchema.parse(message)
    updatePopupBadge({ pendingUpgrade: !migrated })
    browser.action.openPopup()
  }

  return true
})
