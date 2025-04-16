import browser from 'webextension-polyfill'

import type { ScriptFile } from '@/types/file-assets'

export const initScript = ({ tabId, file, debugMessage }: { tabId: number; file: ScriptFile; debugMessage: string }) =>
  browser.scripting
    .executeScript({
      target: { tabId },
      files: [`${file.path}.js`]
    })
    .then(() => {
      console.debug(debugMessage)
    })

export const updatePopupBadge = ({ pendingUpgrade }: { pendingUpgrade: boolean }) => {
  if ('setBadgeText' in browser.action) {
    browser.action.setBadgeText({ text: pendingUpgrade ? '1' : '' })
  }

  if ('setBadgeBackgroundColor' in browser.action) {
    browser.action.setBadgeBackgroundColor({ color: pendingUpgrade ? '#FF0000' : '#00FF00' })
  }
}
