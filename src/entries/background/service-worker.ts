import browser from 'webextension-polyfill'

import { runRawgReleaseDayCheck, wireRawgReleaseListeners } from '@/entries/background/rawg-release-alarms'
import { wireSteamImgbbHandlers } from '@/entries/background/steam-imgbb-handlers'
import { wireSteamHandlers } from '@/entries/background/steam-handlers'
import { DEFAULT_GLOBAL_CONFIG, getGlobalConfig, setGlobalConfig } from '@/services/config'
import { getPerformedUpgradeTasks, setMigratedFromVersion, setPerformedUpgradeTask, UPGRADE_TASK_IDS } from '@/services/upgrades'
import { MigratedFromLocalStoragePayloadSchema } from '@/types/event-messages'
import { devLog } from '@/utils/logging'

wireRawgReleaseListeners()
wireSteamImgbbHandlers()
wireSteamHandlers()

browser.runtime.onInstalled.addListener(async ({ reason, previousVersion }) => {
  if (reason === 'update' && previousVersion) await setMigratedFromVersion(previousVersion)

  const upgradeTasks = await getPerformedUpgradeTasks()
  const unfinishedTasks = upgradeTasks.filter(({ migrated }) => !migrated)
  const { auto = [] } = Object.groupBy(unfinishedTasks, item => item.type)

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

  void runRawgReleaseDayCheck()

  console.debug(`Extension has been ${reason}ed`)
})

/**
 * IMPORTANTE: en webextension-polyfill, varios listeners pueden registrarse para
 * `runtime.onMessage`; el polyfill se queda con la PRIMERA promesa que resuelve.
 * Si este listener fuese `async` devolvería `Promise<undefined>` para todos los
 * mensajes que no le competen (Steam, etc.), ganando la carrera y descartando
 * la respuesta del listener correcto. Por eso debe ser SÍNCRONO y sólo devolver
 * una promesa cuando va a responder al mensaje en cuestión.
 */
browser.runtime.onMessage.addListener(message => {
  if (message === 'mvtools-rawg-cache-updated') {
    void runRawgReleaseDayCheck()
    return undefined
  }
  const migrated = MigratedFromLocalStoragePayloadSchema.safeParse(message)
  if (!migrated.success) return undefined
  return (async () => {
    await setPerformedUpgradeTask(UPGRADE_TASK_IDS.MIGRATED_FROM_LOCAL_STORAGE, migrated.data.migrated)
    void runRawgReleaseDayCheck()
  })()
})
