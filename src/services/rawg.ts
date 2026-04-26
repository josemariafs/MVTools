import { z } from 'zod'

import { buildUpcomingReleasesDateRangeKeys, isRawgUpcomingCacheFresh } from '@/services/rawg-helpers'
import { getLocalStoredProperty, setLocalStoredProperty } from '@/services/storage'
import {
  type RawgGameDetail,
  rawgGameDetailSchema,
  type RawgGameListItem,
  rawgGamesPageSchema,
  rawgGameStoresPageSchema,
  type RawgUpcomingCache,
  rawgUpcomingCacheSchema
} from '@/types/rawg'
import { BROWSER_STORAGE_KEYS } from '@/types/storage'

export {
  buildUpcomingReleasesDateRangeKeys,
  groupGamesByReleaseDate,
  isRawgUpcomingCacheFresh,
  RAWG_UPCOMING_CACHE_TTL_MS
} from '@/services/rawg-helpers'

const RAWG_BASE = 'https://api.rawg.io/api'
const MAX_EXTRA_PAGES = 2

const rawgErrorSchema = z.object({ error: z.string().optional() })

async function fetchGamesPage(apiKey: string, dates: string, page: number): Promise<RawgGameListItem[]> {
  const url = new URL(`${RAWG_BASE}/games`)
  url.searchParams.set('key', apiKey)
  url.searchParams.set('dates', dates)
  url.searchParams.set('ordering', 'released')
  url.searchParams.set('page_size', '40')
  url.searchParams.set('page', String(page))

  const res = await fetch(url.toString(), { method: 'GET' })
  const json: unknown = await res.json()
  if (!res.ok) {
    const err = rawgErrorSchema.safeParse(json)
    throw new Error(
      res.status === 429
        ? 'Límite de peticiones RAWG (429). Espera o revisa el plan de API.'
        : res.status === 401 || res.status === 403
          ? 'API key RAWG no válida o sin permisos.'
          : `RAWG: ${res.status} ${err.success ? err.data.error : ''}`.trim()
    )
  }
  const pageData = rawgGamesPageSchema.parse(json)
  return pageData.results
}

async function fetchAllGamesInDateRange(apiKey: string, dateRangeKey: string): Promise<RawgGameListItem[]> {
  const out: RawgGameListItem[] = []
  let nextPage = 1
  for (let i = 0; i < 1 + MAX_EXTRA_PAGES; i++) {
    const page = await fetchGamesPage(apiKey, dateRangeKey, nextPage)
    out.push(...page)
    if (page.length < 40) break
    nextPage += 1
  }
  return out
}

async function getCachedUpcomingGamesImpl(dateRangeKey: string): Promise<RawgUpcomingCache | null> {
  const raw = await getLocalStoredProperty<unknown>(BROWSER_STORAGE_KEYS.RAWG_UPCOMING_CACHE, null)
  if (raw === null) return null
  const parsed = rawgUpcomingCacheSchema.safeParse(raw)
  if (!parsed.success) return null
  if (parsed.data.dateRangeKey !== dateRangeKey) return null
  return parsed.data
}

export async function getCachedUpcomingGames(dateRangeKey: string): Promise<RawgUpcomingCache | null> {
  return await getCachedUpcomingGamesImpl(dateRangeKey)
}

export async function setCachedUpcomingGames(data: RawgUpcomingCache): Promise<void> {
  await setLocalStoredProperty(BROWSER_STORAGE_KEYS.RAWG_UPCOMING_CACHE, data)
}

export type FetchUpcomingReleasesResult =
  | { kind: 'ok'; games: RawgGameListItem[]; fromCache: boolean; dateRangeKey: string }
  | { kind: 'error'; message: string; dateRangeKey: string }
  | { kind: 'no_key'; message: string; dateRangeKey: string }

async function fetchAndCacheUpcoming(
  apiKey: string,
  dateRangeKey: string,
  time: number
): Promise<Extract<FetchUpcomingReleasesResult, { kind: 'ok' } | { kind: 'error' }>> {
  try {
    const games = await fetchAllGamesInDateRange(apiKey, dateRangeKey)
    const cache: RawgUpcomingCache = { dateRangeKey, fetchedAt: time, games }
    await setCachedUpcomingGames(cache)
    return { kind: 'ok' as const, games, fromCache: false, dateRangeKey }
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Error al consultar RAWG'
    return { kind: 'error' as const, message, dateRangeKey }
  }
}

/**
 * Cliente de lanzamientos 30d (Story 1.1 + 1.3)
 */
export async function fetchUpcomingReleases(
  apiKey: string,
  options?: { forceRefresh?: boolean; now?: number }
): Promise<FetchUpcomingReleasesResult> {
  const { dateRangeKey } = buildUpcomingReleasesDateRangeKeys(options?.now)
  const key = apiKey.trim()
  if (!key) {
    return { kind: 'no_key', message: 'Configura la API key de RAWG en el popup de la extensión.', dateRangeKey }
  }

  const time = options?.now ?? Date.now()

  if (!options?.forceRefresh) {
    const cached = await getCachedUpcomingGamesImpl(dateRangeKey)
    if (cached && isRawgUpcomingCacheFresh(cached, time)) {
      return { kind: 'ok', games: cached.games, fromCache: true, dateRangeKey }
    }
  }

  return await fetchAndCacheUpcoming(key, dateRangeKey, time)
}

/**
 * Ficha de juego (GET /api/games/{id}) — Épica 2
 */
export async function fetchRawgGameById(apiKey: string, gameId: number): Promise<RawgGameDetail> {
  const key = apiKey.trim()
  if (!key) {
    throw new Error('Falta API key de RAWG.')
  }
  const url = new URL(`${RAWG_BASE}/games/${gameId}`)
  url.searchParams.set('key', key)
  const res = await fetch(url.toString(), { method: 'GET' })
  const json: unknown = await res.json()
  if (!res.ok) {
    const err = rawgErrorSchema.safeParse(json)
    throw new Error(
      res.status === 404
        ? 'Juego no encontrado en RAWG.'
        : `RAWG detalle: ${res.status} ${err.success ? (err.data.error ?? '') : ''}`.trim()
    )
  }
  const parsed = rawgGameDetailSchema.safeParse(json)
  if (!parsed.success) {
    console.warn('[MV Tools] Esquema RAWG ficha juego no encajó (parsing laxo)', parsed.error.flatten())
    if (json && typeof json === 'object' && 'id' in json && 'name' in json) {
      // Mejor un draft incompleto que romper el flujo de creación de hilo.
      return json as RawgGameDetail
    }
    throw new Error('Formato inesperado al cargar la ficha del juego (RAWG).')
  }
  return parsed.data
}

/**
 * Devuelve mapa `{ [storeId]: url }` con las URLs reales de las tiendas asociadas al
 * juego. RAWG: `GET /api/games/{id}/stores`.
 *
 * @returns Mapa vacío si la API responde con error o sin URLs (no rompe el flujo).
 */
export async function fetchRawgGameStoresUrls(apiKey: string, gameId: number): Promise<Record<number, string>> {
  const key = apiKey.trim()
  if (!key) return {}
  try {
    const url = new URL(`${RAWG_BASE}/games/${gameId}/stores`)
    url.searchParams.set('key', key)
    const res = await fetch(url.toString(), { method: 'GET' })
    if (!res.ok) return {}
    const json: unknown = await res.json()
    const parsed = rawgGameStoresPageSchema.safeParse(json)
    if (!parsed.success) return {}
    const out: Record<number, string> = {}
    for (const r of parsed.data.results) {
      if (typeof r.store_id === 'number' && typeof r.url === 'string' && r.url.trim() !== '') {
        out[r.store_id] = r.url.trim()
      }
    }
    return out
  } catch (e) {
    console.warn('[MV Tools] No se pudieron resolver las URLs de tienda RAWG', e)
    return {}
  }
}
