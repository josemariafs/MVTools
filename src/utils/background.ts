import browser from 'webextension-polyfill'

import type { ScriptArgObjects, ScriptFileObject, ScriptKey } from '@/types/content-script-assets'

export const initScriptFile = async <T extends ScriptKey>({
  tabId,
  file,
  args,
  debugMessage
}: {
  tabId: number
  file: ScriptFileObject<T>
  args: ScriptArgObjects[T]
  debugMessage: string
}) => {
  await browser.scripting.executeScript({
    target: { tabId },
    args: [args],
    func: (args: ScriptArgObjects[T]) => Object.assign(self, args)
  })
  await browser.scripting
    .executeScript({
      target: { tabId },
      files: [`${file.path}.js`]
    })
    .then(() => {
      console.debug(debugMessage)
    })
}

export const updatePopupBadge = ({ pendingUpgrade }: { pendingUpgrade: boolean }) => {
  if ('setBadgeText' in browser.action) {
    browser.action.setBadgeText({ text: pendingUpgrade ? '1' : '' })
  }

  if ('setBadgeBackgroundColor' in browser.action) {
    browser.action.setBadgeBackgroundColor({ color: pendingUpgrade ? '#FF0000' : '#00FF00' })
  }
}
