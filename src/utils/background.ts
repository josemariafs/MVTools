import browser from 'webextension-polyfill'

import { getUnnotifiedGamesReleasingToday } from '@/services/rawg-release-watcher'
import { getPerformedUpgradeTasks } from '@/services/upgrades'
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

/** Prioridad: lanzamientos hoy (naranja) > migración pendiente (rojo) > sin badge. Épica 3. */
export const applyActionBadge = async (opts: { manualUpgradePending: boolean; releaseCountToday: number }) => {
  if (!('setBadgeText' in browser.action) || !('setBadgeBackgroundColor' in browser.action)) {
    return
  }
  if (opts.releaseCountToday > 0) {
    const text = String(Math.min(opts.releaseCountToday, 99))
    await browser.action.setBadgeText({ text })
    await browser.action.setBadgeBackgroundColor({ color: '#E66000' })
  } else if (opts.manualUpgradePending) {
    await browser.action.setBadgeText({ text: '1' })
    await browser.action.setBadgeBackgroundColor({ color: '#FF0000' })
  } else {
    await browser.action.setBadgeText({ text: '' })
  }
}

export const applyActionBadgeState = async () => {
  const { allToday } = await getUnnotifiedGamesReleasingToday()
  const tasks = await getPerformedUpgradeTasks()
  const manual = tasks.filter(t => !t.migrated && t.type === 'manual')
  await applyActionBadge({ manualUpgradePending: manual.length > 0, releaseCountToday: allToday.length })
}
