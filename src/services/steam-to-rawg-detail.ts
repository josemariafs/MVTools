import type { RawgGameDetail } from '@/types/rawg'
import { RAWG_STORE_ID, type SteamGameInfo } from '@/services/steam-store'

function steamPlatformsToRawgPlatforms(steam: SteamGameInfo): NonNullable<RawgGameDetail['platforms']> {
  const p = steam.platformFlags
  const out: NonNullable<RawgGameDetail['platforms']> = []
  if (p?.windows) out.push({ platform: { name: 'PC', slug: 'pc' } })
  if (p?.mac) out.push({ platform: { name: 'Mac', slug: 'mac' } })
  if (p?.linux) out.push({ platform: { name: 'Linux', slug: 'linux' } })
  if (out.length === 0) out.push({ platform: { name: 'PC', slug: 'pc' } })
  return out
}

/**
 * Ficha RAWG mínima generada sólo desde Steam, para reutilizar `buildJuegosThreadDraft`.
 */
export function rawgDetailFromSteamOnly(steam: SteamGameInfo): RawgGameDetail {
  const name = steam.name?.trim() || 'Videojuego'
  const genres = (steam.genres ?? []).map(description => ({ name: description }))
  const developers = (steam.developers ?? []).map(n => ({ name: n }))
  const publishers = (steam.publishers ?? []).map(n => ({ name: n }))
  const shots = steam.screenshots.map((image, i) => ({ id: i + 1, image }))

  return {
    id: steam.appId,
    name,
    description: steam.shortDescription ?? null,
    released: steam.releaseDateIso ?? null,
    background_image: steam.headerImage ?? null,
    website: steam.storeUrl,
    short_screenshots: shots.length > 0 ? shots : undefined,
    platforms: steamPlatformsToRawgPlatforms(steam),
    genres: genres.length > 0 ? genres : undefined,
    developers: developers.length > 0 ? developers : undefined,
    publishers: publishers.length > 0 ? publishers : undefined,
    stores: [{ store: { id: RAWG_STORE_ID.STEAM, name: 'Steam' }, store_id: RAWG_STORE_ID.STEAM }],
    movies: []
  }
}
