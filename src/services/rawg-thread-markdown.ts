import { inferMediavidaJuegosCategory } from '@/services/mediavida-juegos-category'
import { STEAM_SCREENSHOT_LIMIT, type SteamGameInfo } from '@/services/steam-store'
import type { RawgGameDetail } from '@/types/rawg'

/** Mediavida embed de imágenes en foro */
export const mvImg = (url: string): string => {
  const u = url.trim()
  if (!u) return ''
  return `[img]${u}[/img]`
}

/** `[url=…]texto[/url]` Mediavida (BBCode) */
export const mvUrl = (href: string, text: string): string => {
  const h = href.trim()
  const t = text.trim()
  if (!h || !t) return ''
  return `[url=${h}]${t}[/url]`
}

/** Miniatura clicable (`[url][img][/img][/url]`). */
export const mvLinkedImg = (href: string, imgUrl: string): string => {
  const h = href.trim()
  const i = imgUrl.trim()
  if (!h || !i) return ''
  return `[url=${h}][img]${i}[/img][/url]`
}

/** Reproductor Mediavida (`[media]URL[/media]`). */
export const mvMedia = (url: string): string => {
  const u = url.trim()
  if (!u) return ''
  return `[media]${u}[/media]`
}

function normalizeYoutubeToWatchUrl(url: string): string {
  const u = url.trim()
  const embed = /youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/i.exec(u)
  if (embed) return `https://www.youtube.com/watch?v=${embed[1]}`
  const short = /youtu\.be\/([a-zA-Z0-9_-]{6,})/i.exec(u)
  if (short) return `https://www.youtube.com/watch?v=${short[1]}`
  return u
}

function isSteamPlaybackUrlOkForEmbed(url: string): boolean {
  return !/\.m3u8(\?|$)/i.test(url.trim())
}

/** Primera URL apta para `[media]` en el array `movies` de RAWG. */
export function pickRawgMovieMediaUrl(detail: RawgGameDetail): string | null {
  const movies = detail.movies
  if (!movies?.length) return null

  const normalizeCandidate = (raw: unknown): string | null => {
    if (typeof raw !== 'string' || !raw.trim()) return null
    const s = raw.trim()
    if (/youtube\.com\/embed\//i.test(s) || /youtu\.be\//i.test(s) || /youtube\.com\/watch\?/i.test(s)) {
      return normalizeYoutubeToWatchUrl(s)
    }
    if (/\.(mp4|webm)(\?|$)/i.test(s)) return s
    return null
  }

  for (const movie of movies) {
    const data = movie.data
    if (!data || typeof data !== 'object') continue
    for (const key of ['max', '480']) {
      const hit = normalizeCandidate(data[key])
      if (hit) return hit
    }
    for (const v of Object.values(data)) {
      const hit = normalizeCandidate(v)
      if (hit) return hit
    }
  }
  return null
}

function normalizeYoutubeWatchCandidate(url: string | null | undefined): string | null {
  const u = url?.trim()
  if (!u) return null
  if (/youtube\.com\/watch\?v=/i.test(u) || /youtu\.be\//i.test(u)) return normalizeYoutubeToWatchUrl(u)
  return null
}

/**
 * Orden: clips en la ficha RAWG → vídeo YouTube (endpoint RAWG, opciones del caller) → tráiler Steam (no HLS).
 */
function resolveMediavidaMediaEmbedUrl(
  detail: RawgGameDetail,
  steam: SteamGameInfo | null | undefined,
  rawgYoutubeWatchUrl?: string | null
): string | null {
  const fromMovies = pickRawgMovieMediaUrl(detail)
  if (fromMovies) return fromMovies

  const fromYtApi = normalizeYoutubeWatchCandidate(rawgYoutubeWatchUrl)
  if (fromYtApi) return fromYtApi

  const steamUrl = steam?.trailer?.playbackUrl?.trim()
  if (steamUrl && isSteamPlaybackUrlOkForEmbed(steamUrl)) return steamUrl

  return null
}

function mediavidaVideoBbCode(embedUrl: string | null): string {
  const u = embedUrl?.trim()
  if (!u) return ''
  return `\n## Vídeo\n\n${mvMedia(u)}\n`
}

/**
 * Texto plano desde posible HTML de la API RAWG.
 */
export function stripHtmlToText(html: string | null | undefined): string {
  if (!html?.trim()) return ''
  if (typeof document !== 'undefined') {
    const d = document.createElement('div')
    d.innerHTML = html
    return d.textContent?.replace(/\s+/g, ' ').trim() ?? ''
  }
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function namedList(values: ReadonlyArray<{ name?: string }> | null | undefined): string {
  if (!values?.length) return ''
  const names = values.map(v => v.name?.trim()).filter((n): n is string => Boolean(n))
  return names.join(', ')
}

/**
 * `released` (YYYY-MM-DD) → `DD-MM` para el título del hilo.
 * Sin fecha válida: `N/D`.
 */
export function formatReleaseDayMonthForTitle(released: string | null | undefined): string {
  if (!released?.trim()) return 'N/D'
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(released.trim())
  if (m) {
    return `${m[3]}-${m[2]}`
  }
  return 'N/D'
}

function platformNames(detail: RawgGameDetail): string {
  const list = detail.platforms ?? []
  if (!list.length) return ''
  const names = list.map(p => p.platform?.name?.trim()).filter((n): n is string => Boolean(n))
  return names.join(', ')
}

/** ID de tienda RAWG → etiqueta humana */
const STORE_LABELS: Record<number, string> = {
  1: 'Steam',
  5: 'GOG',
  11: 'Epic Games'
}

/** Sólo nos interesan las tres tiendas pedidas. */
const STORE_ALLOWLIST = new Set<number>([1, 5, 11])

/** URL absoluta o `null` si no parece http(s). */
function normalizeStoreUrl(url: string | undefined | null): string | null {
  if (!url) return null
  const trimmed = url.trim()
  if (!/^https?:\/\//i.test(trimmed)) return null
  return trimmed
}

/**
 * Devuelve los enlaces de tienda en orden Steam → Epic → GOG, ya como BBCode listo.
 *
 * @param detail Ficha completa de RAWG.
 * @param overrideUrls Mapa `storeId → url real` (típicamente de `/games/{id}/stores`).
 *   Tiene prioridad sobre `detail.stores[i].url` (que en el endpoint principal apunta
 *   al detalle de RAWG, no a la tienda real).
 */
export function buildStoreLinks(detail: RawgGameDetail, overrideUrls: Record<number, string> = {}): string[] {
  const stores = detail.stores ?? []
  const seen = new Set<number>()
  const out: Array<{ id: number; line: string }> = []
  for (const entry of stores) {
    const storeId = entry.store?.id ?? entry.store_id
    if (typeof storeId !== 'number') continue
    if (!STORE_ALLOWLIST.has(storeId)) continue
    if (seen.has(storeId)) continue
    const url = normalizeStoreUrl(overrideUrls[storeId]) ?? normalizeStoreUrl(entry.url)
    if (!url) continue
    seen.add(storeId)
    const label = STORE_LABELS[storeId] ?? entry.store?.name ?? 'Tienda'
    out.push({ id: storeId, line: mvUrl(url, label) })
  }
  // Tiendas en allowlist sólo presentes en override (p. ej. Steam resuelto por búsqueda sin fila RAWG).
  for (const storeId of [1, 11, 5] as const) {
    if (seen.has(storeId)) continue
    const url = normalizeStoreUrl(overrideUrls[storeId])
    if (!url) continue
    seen.add(storeId)
    const label = STORE_LABELS[storeId] ?? 'Tienda'
    out.push({ id: storeId, line: mvUrl(url, label) })
  }
  // Orden estable: Steam (1) → Epic (11) → GOG (5).
  const orderRank: Record<number, number> = { 1: 0, 11: 1, 5: 2 }
  out.sort((a, b) => (orderRank[a.id] ?? 99) - (orderRank[b.id] ?? 99))
  return out.map(o => o.line)
}

export interface ThreadDraft {
  title: string
  body: string
  category: string
}

export interface BuildThreadOptions {
  /** Override de URLs reales por id de tienda RAWG (1=Steam, 5=GOG, 11=Epic). */
  storeUrls?: Record<number, string>
  /** Datos de Steam (capturas, descripción ES, header). Se usa si está disponible. */
  steam?: SteamGameInfo | null
  /** Primer vídeo YouTube desde GET /api/games/{id}/youtube (`watch?v=`). */
  rawgYoutubeWatchUrl?: string | null
}

/**
 * Cuerpo en BBCode/Markdown estilo Mediavida (Épica 2):
 *  - Cabecera visual.
 *  - Ficha (lanzamiento, plataformas, géneros, desarrolladora, distribuidora, web, tiendas).
 *  - Descripción **en español** (Steam si disponible, RAWG en otro caso).
 *  - Tráiler `[media]`: clips RAWG (`movies` / YouTube API), luego Steam DASH si no hay YouTube (no `.m3u8`). Sin enlace duplicado a Steam en esta sección.
 *  - Capturas (Steam si disponible, RAWG en otro caso), máx. 3 además de la cabecera.
 */
export function buildJuegosThreadDraft(detail: RawgGameDetail, options: BuildThreadOptions = {}): ThreadDraft {
  const { storeUrls = {}, steam, rawgYoutubeWatchUrl } = options

  const nameOnly = detail.name.trim() || 'Videojuego'
  const dayMonth = formatReleaseDayMonthForTitle(detail.released)
  const title = `${nameOnly} | Lanzamiento ${dayMonth}`

  const released = detail.released?.trim() || 'Sin fecha confirmada'
  const plats = platformNames(detail)
  const genres = namedList(detail.genres ?? [])
  const developers = namedList(detail.developers ?? [])
  const publishers = namedList(detail.publishers ?? [])
  const site = detail.website?.trim()

  const fichaLines: string[] = [`**Lanzamiento:** ${released}`]
  if (plats) fichaLines.push(`**Plataformas:** ${plats}`)
  if (genres) fichaLines.push(`**Géneros:** ${genres}`)
  if (developers) fichaLines.push(`**Desarrolladora:** ${developers}`)
  if (publishers && publishers !== developers) fichaLines.push(`**Distribuidora:** ${publishers}`)
  if (site) fichaLines.push(`**Web oficial:** ${site}`)

  const storeLinks = buildStoreLinks(detail, storeUrls)
  if (storeLinks.length > 0) {
    fichaLines.push(`**Comprar:** ${storeLinks.join(' · ')}`)
  }

  const meta = fichaLines.join('\n')

  const headerUrl = steam?.headerImage?.trim() || detail.background_image?.trim() || detail.background_image_additional?.trim() || ''
  // El título del formulario va en `title` (formato largo); en el cuerpo el H1 queda con el nombre del juego.
  const headerBlock = headerUrl ? `# ${nameOnly}\n\n${mvImg(headerUrl)}\n\n` : `# ${nameOnly}\n\n`

  // --- Descripción en español ---
  const steamDesc = stripHtmlToText(steam?.shortDescription)
  const rawgDesc = stripHtmlToText(detail.description ?? detail.description_raw)
  const desc = steamDesc || rawgDesc || 'Sin descripción disponible.'
  const descNote = !steamDesc && rawgDesc ? '\n\n_Descripción original en inglés (no hay versión en español disponible en RAWG)._' : ''

  const embedUrl = resolveMediavidaMediaEmbedUrl(detail, steam ?? null, rawgYoutubeWatchUrl)
  const videoBlock = mediavidaVideoBbCode(embedUrl)

  // --- Capturas: Steam tiene prioridad; máx. 3 que no dupliquen la cabecera. ---
  const headerNorm = headerUrl.trim()
  const steamShots = steam?.screenshots ?? []
  const rawgShots = (detail.short_screenshots ?? [])
    .map(s => s.image)
    .filter((url): url is string => typeof url === 'string' && url.trim() !== '')
  const gallery = (steamShots.length > 0 ? steamShots : rawgShots)
    .filter(u => !headerNorm || u.trim() !== headerNorm)
    .slice(0, STEAM_SCREENSHOT_LIMIT)
  const shotsBlock = gallery.length > 0 ? `\n## Capturas\n\n${gallery.map(mvImg).join('\n\n')}\n` : ''

  const body = `${headerBlock}## Ficha\n\n${meta}\n\n## Descripción\n\n${desc}${descNote}${videoBlock}${shotsBlock}`

  return { title, body, category: inferMediavidaJuegosCategory(detail) }
}
