import browser from 'webextension-polyfill'
import { z } from 'zod'

import { fetchSteamAppDetails, type SteamGameInfo } from '@/services/steam-store'

/**
 * Mensajería entre content script (mediavida.com) y background. El fetch tiene que
 * salir desde el background porque store.steampowered.com no permite CORS desde
 * mediavida.com.
 */
export const STEAM_APPDETAILS_MSG = 'mvtools-steam-appdetails' as const

const requestSchema = z.object({
  type: z.literal(STEAM_APPDETAILS_MSG),
  appId: z.number().int().positive(),
  l: z.string().optional(),
  cc: z.string().optional()
})

export type SteamAppDetailsRequest = z.infer<typeof requestSchema>
export type SteamAppDetailsResponse = { ok: true; info: SteamGameInfo } | { ok: false; error: string }

/** Helper tipado para el caller (content script / popup). */
export async function requestSteamAppDetails(appId: number, opts?: { l?: string; cc?: string }): Promise<SteamAppDetailsResponse> {
  const message: SteamAppDetailsRequest = { type: STEAM_APPDETAILS_MSG, appId, ...opts }
  try {
    const res = await browser.runtime.sendMessage(message)
    if (!res) {
      return { ok: false, error: 'El background no respondió a la consulta a Steam.' }
    }
    return res
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Error de mensajería con el background.' }
  }
}

/**
 * Registra el listener. Devuelve la promesa para que webextension-polyfill
 * resuelva el sendResponse correctamente.
 */
export function wireSteamHandlers(): void {
  browser.runtime.onMessage.addListener(message => {
    const parsed = requestSchema.safeParse(message)
    if (!parsed.success) return undefined
    return fetchSteamAppDetails(parsed.data.appId, { l: parsed.data.l, cc: parsed.data.cc })
      .then(info => ({ ok: true as const, info }))
      .catch(e => {
        const error = e instanceof Error ? e.message : 'Error desconocido al consultar Steam'
        console.warn('[MV Tools] Steam appdetails falló', error)
        return { ok: false as const, error }
      })
  })
}
