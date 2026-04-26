import browser from 'webextension-polyfill'

import { applyActionBadgeState } from '@/utils/background'
import { devLog } from '@/utils/logging'

/**
 * Actualiza el badge del icono con lanzamientos del día (caché RAWG local).
 * Sin notificaciones del sistema ni alarmas periódicas (menos permisos en el manifiesto).
 */
export async function runRawgReleaseDayCheck() {
  try {
    await applyActionBadgeState()
  } catch (e) {
    devLog.error('rawg release badge', e)
  }
}

export function wireRawgReleaseListeners() {
  browser.runtime.onStartup.addListener(() => {
    void runRawgReleaseDayCheck()
  })
}
