import browser from 'webextension-polyfill'
import { z } from 'zod'

import { STEAM_MIRROR_IMGBB_MSG, type SteamMirrorImgbbResponse } from '@/entries/background/steam-imgbb-client'
import { getGlobalConfig } from '@/services/config'
import { uploadImageBlobToImgbb } from '@/services/imgbb-upload'
import { normalizeRemoteImageForForumUpload } from '@/services/steam-image-normalize-sw'
import type { SteamGameInfo } from '@/services/steam-store'

const mirrorRequestSchema = z.object({
  type: z.literal(STEAM_MIRROR_IMGBB_MSG),
  steam: z.record(z.unknown())
})

function isSteamGameInfoLike(s: Record<string, unknown>): boolean {
  return (
    typeof s.appId === 'number' &&
    Number.isFinite(s.appId) &&
    typeof s.storeUrl === 'string' &&
    Array.isArray(s.screenshots) &&
    s.screenshots.every(x => typeof x === 'string')
  )
}

async function mirrorSteamImagesToImgbb(steam: SteamGameInfo): Promise<SteamGameInfo> {
  const { imgbbApiKey } = await getGlobalConfig()
  const key = imgbbApiKey.trim()
  if (!key) {
    return steam
  }

  const out: SteamGameInfo = { ...steam, screenshots: [...steam.screenshots] }

  const header = steam.headerImage?.trim()
  if (header) {
    const blob = await normalizeRemoteImageForForumUpload(header)
    if (blob) {
      try {
        const url = await uploadImageBlobToImgbb(blob, key)
        out.headerImage = url
      } catch (e) {
        console.warn('[MV Tools] ImgBB cabecera Steam', e)
      }
    }
  }

  out.screenshots = await Promise.all(
    steam.screenshots.map(async shot => {
      const blob = await normalizeRemoteImageForForumUpload(shot)
      if (!blob) return shot
      try {
        return await uploadImageBlobToImgbb(blob, key)
      } catch (e) {
        console.warn('[MV Tools] ImgBB captura Steam', e)
        return shot
      }
    })
  )

  return out
}

export function wireSteamImgbbHandlers(): void {
  browser.runtime.onMessage.addListener((message): Promise<SteamMirrorImgbbResponse> | undefined => {
    const parsed = mirrorRequestSchema.safeParse(message)
    if (!parsed.success) return undefined

    const raw = parsed.data.steam
    if (!isSteamGameInfoLike(raw)) {
      return Promise.resolve({ ok: false, error: 'Payload Steam inválido para ImgBB.' })
    }

    return mirrorSteamImagesToImgbb(raw as unknown as SteamGameInfo).then(steam => ({ ok: true as const, steam }))
  })
}
