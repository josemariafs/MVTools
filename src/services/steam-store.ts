import { z } from 'zod'

import { parseSteamReleaseDateToIso } from '@/services/steam-release-date'

/**
 * Cliente ligero para la Store Web API de Steam (`appdetails`, `storesearch`).
 *
 * - Llamado SIEMPRE desde el background (CORS prohibe la llamada desde un content
 *   script que vive en mediavida.com). Ver `entries/background/steam-handlers.ts`.
 * - Pedimos `cc=es&l=spanish` para conseguir descripción en castellano cuando exista.
 */

/** ID de tienda RAWG → Steam */
export const RAWG_STORE_ID = {
  STEAM: 1,
  GOG: 5,
  EPIC: 11
} as const

/** Extrae el AppID numérico de una URL `store.steampowered.com/app/{id}/...`. */
export function extractSteamAppIdFromUrl(url: string | null | undefined): number | null {
  if (!url) return null
  const match = /store\.steampowered\.com\/app\/(\d+)/i.exec(url)
  const raw = match?.[1]
  if (!raw) return null
  const n = Number.parseInt(raw, 10)
  return Number.isFinite(n) && n > 0 ? n : null
}

/** URL de tienda Steam o sólo el AppID numérico (p. ej. `730`). */
export function parseSteamAppIdFromInput(input: string): number | null {
  const t = input.trim()
  if (!t) return null
  const fromUrl = extractSteamAppIdFromUrl(t)
  if (fromUrl != null) return fromUrl
  if (/^\d+$/.test(t)) {
    const n = Number.parseInt(t, 10)
    return Number.isFinite(n) && n > 0 ? n : null
  }
  return null
}

const screenshotSchema = z
  .object({
    id: z.number().optional(),
    path_thumbnail: z.string().optional(),
    path_full: z.string().optional()
  })
  .partial()

const steamMovieSchema = z
  .object({
    id: z.number().optional(),
    name: z.string().optional(),
    thumbnail: z.string().optional(),
    hls_h264: z.string().optional(),
    dash_h264: z.string().optional(),
    dash_av1: z.string().optional(),
    highlight: z.boolean().optional()
  })
  .passthrough()

const steamGenreEntrySchema = z
  .object({
    id: z.string().optional(),
    description: z.string().optional()
  })
  .partial()

const steamDevPubEntrySchema = z.union([z.string(), z.object({ name: z.string().optional() }).partial()])

const steamPlatformsSchema = z
  .object({
    windows: z.boolean().optional(),
    mac: z.boolean().optional(),
    linux: z.boolean().optional()
  })
  .partial()

const steamReleaseDateSchema = z
  .object({
    coming_soon: z.boolean().optional(),
    date: z.string().optional()
  })
  .partial()

const appDetailsDataSchema = z
  .object({
    name: z.string().optional(),
    short_description: z.string().optional(),
    detailed_description: z.string().optional(),
    about_the_game: z.string().optional(),
    header_image: z.string().optional(),
    capsule_image: z.string().optional(),
    screenshots: z.array(screenshotSchema).optional(),
    movies: z.array(steamMovieSchema).optional(),
    release_date: steamReleaseDateSchema.optional(),
    genres: z.array(steamGenreEntrySchema).optional(),
    developers: z.array(steamDevPubEntrySchema).optional(),
    publishers: z.array(steamDevPubEntrySchema).optional(),
    platforms: steamPlatformsSchema.optional()
  })
  .partial()

const appDetailsResponseEntrySchema = z.object({
  success: z.boolean(),
  data: appDetailsDataSchema.optional()
})

/** Respuesta cruda: `{ "<appid>": { success, data? } }` */
export const appDetailsResponseSchema = z.record(z.string(), appDetailsResponseEntrySchema)
export type AppDetailsResponse = z.infer<typeof appDetailsResponseSchema>

/** Tráiler de la tienda Steam (DASH/HLS según disponibilidad). */
export interface SteamTrailerInfo {
  name?: string
  thumbnailUrl?: string
  /**
   * Preferencia interna: MPEG-DASH (`.mpd`) antes que HLS (`.m3u8`), más compatible con embeds tipo Mediavida.
   */
  playbackUrl: string
}

/** Subconjunto que usamos para enriquecer la ficha. */
export interface SteamGameInfo {
  appId: number
  name?: string
  shortDescription?: string
  headerImage?: string
  /** URL canónica de tienda (sin parámetros de tracking). */
  storeUrl: string
  /** URLs `path_full` (1920×1080), limitadas. */
  screenshots: string[]
  /** Primer tráiler destacado, o el primero disponible. */
  trailer?: SteamTrailerInfo | null
  /** Fecha lanzamiento Steam como `YYYY-MM-DD` cuando se parseó correctamente. */
  releaseDateIso?: string | null
  genres?: string[]
  developers?: string[]
  publishers?: string[]
  /** Plataformas tienda Steam (para categoría foro). */
  platformFlags?: { windows?: boolean; mac?: boolean; linux?: boolean }
}

const STEAM_API_BASE = 'https://store.steampowered.com/api/appdetails'
const STEAM_STORESEARCH = 'https://store.steampowered.com/api/storesearch/'
/** Capturas que pasamos al hilo (cabecera va aparte). */
export const STEAM_SCREENSHOT_LIMIT = 3

function pickSteamTrailer(movies: z.infer<typeof steamMovieSchema>[] | undefined): SteamTrailerInfo | null {
  if (!movies?.length) return null
  const highlighted = movies.find(m => m.highlight === true)
  const m = highlighted ?? movies[0]
  if (!m) return null
  const playbackUrl = [m.dash_h264, m.dash_av1, m.hls_h264].find(u => typeof u === 'string' && u.trim() !== '')
  if (!playbackUrl) return null
  const thumbnailUrl = m.thumbnail?.trim()
  return {
    name: m.name?.trim(),
    thumbnailUrl: thumbnailUrl || undefined,
    playbackUrl: playbackUrl.trim()
  }
}

const storeSearchItemSchema = z
  .object({
    type: z.string(),
    id: z.number(),
    name: z.string().optional()
  })
  .passthrough()

const storeSearchResponseSchema = z.object({
  items: z.array(storeSearchItemSchema).optional(),
  total: z.number().optional()
})

export interface SteamStoreSearchItem {
  type: string
  id: number
  name: string
}

/** Normaliza títulos para comparar RAWG ↔ Steam (& vs and, puntuación, acentos). */
export function normalizeGameTitleForMatch(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .replace(/\u00a0/g, ' ')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function truncateSteamSearchTerm(title: string, max = 96): string {
  const t = title.trim()
  if (t.length <= max) return t
  const slice = t.slice(0, max)
  const lastSpace = slice.lastIndexOf(' ')
  return lastSpace > 40 ? slice.slice(0, lastSpace) : slice
}

/**
 * Resultados de la tienda Steam (`type`, `id`, `name`). Sólo entradas `type === 'app'`.
 */
export async function fetchSteamStoreSearch(
  term: string,
  languageCc: { l?: string; cc?: string } = {}
): Promise<SteamStoreSearchItem[]> {
  const q = truncateSteamSearchTerm(term)
  if (!q) return []

  const url = new URL(STEAM_STORESEARCH)
  url.searchParams.set('term', q)
  url.searchParams.set('l', languageCc.l ?? 'spanish')
  url.searchParams.set('cc', languageCc.cc ?? 'es')

  const res = await fetch(url.toString(), { method: 'GET' })
  if (!res.ok) {
    throw new Error(`Steam storesearch ${res.status}`)
  }
  const json: unknown = await res.json()
  const parsed = storeSearchResponseSchema.safeParse(json)
  if (!parsed.success) {
    throw new Error('Formato inesperado de Steam storesearch.')
  }
  const items = parsed.data.items ?? []
  const out: SteamStoreSearchItem[] = []
  for (const i of items) {
    if (typeof i.name !== 'string' || !i.name.trim()) continue
    out.push({ type: i.type, id: i.id, name: i.name.trim() })
  }
  return out
}

/**
 * Elige un AppID cuando RAWG no da URL Steam. Descarta demos si el título RAWG no es demo.
 * Exige coincidencia normalizada exacta, inclusión mutua (títulos suficientemente largos) o mismos tokens ordenados.
 */
export function pickSteamAppIdFromSearchResults(rawgTitle: string, items: SteamStoreSearchItem[]): number | null {
  const rawgNorm = normalizeGameTitleForMatch(rawgTitle)
  if (!rawgNorm) return null

  const rawgWantsDemo = /\bdemo\b/i.test(rawgTitle)
  const MIN_LONG = 10

  const filtered = items.filter(i => {
    if (i.type !== 'app' || !Number.isFinite(i.id) || i.id <= 0) return false
    if (rawgWantsDemo) return true
    return !/\bdemo\b/i.test(i.name)
  })

  let bestId: number | null = null
  let bestScore = -1

  for (const item of filtered) {
    const steamNorm = normalizeGameTitleForMatch(item.name)
    if (!steamNorm) continue

    let score = 0
    if (steamNorm === rawgNorm) {
      score = 1000
    } else if (rawgNorm.length >= MIN_LONG && steamNorm.length >= MIN_LONG) {
      if (steamNorm.includes(rawgNorm) || rawgNorm.includes(steamNorm)) {
        score = 500
      } else {
        const rt = rawgNorm.split(' ').filter(Boolean).sort().join(' ')
        const st = steamNorm.split(' ').filter(Boolean).sort().join(' ')
        if (rt.length >= MIN_LONG && rt === st) score = 400
      }
    }

    if (score > bestScore) {
      bestScore = score
      bestId = item.id
    }
  }

  return bestScore >= 400 ? bestId : null
}

/**
 * Busca en la tienda Steam por título y devuelve `appdetails` para el mejor candidato seguro.
 */
export async function resolveSteamGameFromRawgTitle(
  rawgTitle: string,
  languageCc: { l?: string; cc?: string } = {}
): Promise<SteamGameInfo> {
  const term = truncateSteamSearchTerm(rawgTitle.trim())
  if (!term) {
    throw new Error('Título vacío para búsqueda Steam.')
  }

  const items = await fetchSteamStoreSearch(term, languageCc)
  const appId = pickSteamAppIdFromSearchResults(rawgTitle, items)
  if (appId == null) {
    throw new Error('Steam storesearch sin coincidencia segura para este título.')
  }

  return fetchSteamAppDetails(appId, languageCc)
}

/**
 * Llama a `appdetails` y normaliza los datos. Lanza con mensaje legible si falla,
 * porque el caller decide si tolerar el error o propagarlo.
 */
export async function fetchSteamAppDetails(appId: number, languageCc: { l?: string; cc?: string } = {}): Promise<SteamGameInfo> {
  if (!Number.isFinite(appId) || appId <= 0) {
    throw new Error(`AppID Steam inválido: ${String(appId)}`)
  }
  const url = new URL(STEAM_API_BASE)
  url.searchParams.set('appids', String(appId))
  url.searchParams.set('l', languageCc.l ?? 'spanish')
  url.searchParams.set('cc', languageCc.cc ?? 'es')

  const res = await fetch(url.toString(), { method: 'GET' })
  if (!res.ok) {
    throw new Error(`Steam appdetails ${res.status}`)
  }
  const json: unknown = await res.json()
  const parsed = appDetailsResponseSchema.safeParse(json)
  if (!parsed.success) {
    throw new Error('Formato inesperado de Steam appdetails.')
  }
  const entry = parsed.data[String(appId)]
  if (!entry?.success || !entry.data) {
    throw new Error('Steam no devolvió datos para este AppID.')
  }
  const d = entry.data
  const headerTrim = d.header_image?.trim()
  const screenshots = (d.screenshots ?? [])
    .map(s => s.path_full)
    .filter((s): s is string => typeof s === 'string' && s.trim() !== '')
    .filter(url => !headerTrim || url.trim() !== headerTrim)
    .slice(0, STEAM_SCREENSHOT_LIMIT)

  const trailer = pickSteamTrailer(d.movies)

  const genres = (d.genres ?? [])
    .map(g => g.description?.trim())
    .filter((s): s is string => Boolean(s))

  const developers: string[] = []
  for (const x of d.developers ?? []) {
    if (typeof x === 'string') {
      const t = x.trim()
      if (t) developers.push(t)
    } else if (x?.name?.trim()) {
      developers.push(x.name.trim())
    }
  }

  const publishers: string[] = []
  for (const x of d.publishers ?? []) {
    if (typeof x === 'string') {
      const t = x.trim()
      if (t) publishers.push(t)
    } else if (x?.name?.trim()) {
      publishers.push(x.name.trim())
    }
  }

  const pf = d.platforms
  const platformFlags =
    pf && (pf.windows !== undefined || pf.mac !== undefined || pf.linux !== undefined)
      ? { windows: pf.windows === true, mac: pf.mac === true, linux: pf.linux === true }
      : undefined

  let releaseDateIso: string | null = null
  const rd = d.release_date
  if (rd?.coming_soon !== true && rd?.date?.trim()) {
    releaseDateIso = parseSteamReleaseDateToIso(rd.date)
  }

  return {
    appId,
    name: d.name,
    shortDescription: d.short_description,
    headerImage: d.header_image,
    storeUrl: `https://store.steampowered.com/app/${appId}/`,
    screenshots,
    trailer,
    releaseDateIso,
    genres: genres.length > 0 ? genres : undefined,
    developers: developers.length > 0 ? developers : undefined,
    publishers: publishers.length > 0 ? publishers : undefined,
    platformFlags
  }
}
