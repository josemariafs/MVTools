import browser from 'webextension-polyfill'

import type { SteamGameInfo } from '@/services/steam-store'

export const STEAM_MIRROR_IMGBB_MSG = 'mvtools-steam-mirror-imgbb' as const

export type SteamMirrorImgbbResponse = { ok: true; steam: SteamGameInfo } | { ok: false; error: string }

export async function requestSteamMirrorForImgbb(steam: SteamGameInfo): Promise<SteamMirrorImgbbResponse> {
  try {
    const res = await browser.runtime.sendMessage({ type: STEAM_MIRROR_IMGBB_MSG, steam })
    if (!res || typeof res !== 'object' || !('ok' in res)) {
      return { ok: false, error: 'El background no respondió al espejo ImgBB.' }
    }
    return res as SteamMirrorImgbbResponse
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Error de mensajería ImgBB.' }
  }
}
