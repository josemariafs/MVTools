import browser from 'webextension-polyfill'
import { z } from 'zod'

import { fetchSteamAppDetails, resolveSteamGameFromRawgTitle, type SteamGameInfo } from '@/services/steam-store'

/**
 * Mensajería entre content script (mediavida.com) y background. El fetch tiene que
 * salir desde el background porque store.steampowered.com no permite CORS desde
 * mediavida.com.
 */
export const STEAM_APPDETAILS_MSG = 'mvtools-steam-appdetails' as const
/** RAWG sin URL Steam → storesearch + appdetails en el background. */
export const STEAM_RESOLVE_FROM_TITLE_MSG = 'mvtools-steam-resolve-from-title' as const

const requestSchema = z.object({
  type: z.literal(STEAM_APPDETAILS_MSG),
  appId: z.number().int().positive(),
  l: z.string().optional(),
  cc: z.string().optional()
})

const resolveFromTitleSchema = z.object({
  type: z.literal(STEAM_RESOLVE_FROM_TITLE_MSG),
  rawgTitle: z.string().min(1),
  l: z.string().optional(),
  cc: z.string().optional()
})

export type SteamAppDetailsRequest = z.infer<typeof requestSchema>
export type SteamResolveFromTitleRequest = z.infer<typeof resolveFromTitleSchema>
export type SteamAppDetailsResponse = { ok: true; info: SteamGameInfo } | { ok: false; error: string }

/** Helper tipado para el caller (content script / popup). */
export async function requestSteamAppDetails(appId: number, opts?: { l?: string; cc?: string }): Promise<SteamAppDetailsResponse> {
  const message: SteamAppDetailsRequest = { type: STEAM_APPDETAILS_MSG, appId, ...opts }
  try {
    const res = await browser.runtime.sendMessage(message)
    if (!res || typeof res !== 'object' || !('ok' in res)) {
      return { ok: false, error: 'El background no respondió a la consulta a Steam.' }
    }
    return res as SteamAppDetailsResponse
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Error de mensajería con el background.' }
  }
}

/** Busca por título en la tienda Steam y devuelve la misma forma que `requestSteamAppDetails`. */
export async function requestSteamResolveFromRawgTitle(
  rawgTitle: string,
  opts?: { l?: string; cc?: string }
): Promise<SteamAppDetailsResponse> {
  const message: SteamResolveFromTitleRequest = { type: STEAM_RESOLVE_FROM_TITLE_MSG, rawgTitle, ...opts }
  try {
    const res = await browser.runtime.sendMessage(message)
    if (!res || typeof res !== 'object' || !('ok' in res)) {
      return { ok: false, error: 'El background no respondió a la resolución Steam por título.' }
    }
    return res as SteamAppDetailsResponse
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
    const resolved = resolveFromTitleSchema.safeParse(message)
    if (resolved.success) {
      const { rawgTitle, l, cc } = resolved.data
      return resolveSteamGameFromRawgTitle(rawgTitle, { l, cc })
        .then(info => ({ ok: true as const, info }))
        .catch(e => {
          const error = e instanceof Error ? e.message : 'Error desconocido al resolver Steam por título'
          console.warn('[MV Tools] Steam resolve-from-title falló', error)
          return { ok: false as const, error }
        })
    }

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
