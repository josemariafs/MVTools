import { inferMediavidaJuegosCategory } from '@/services/mediavida-juegos-category'
import type { SteamGameInfo } from '@/services/steam-store'
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
}

/**
 * Cuerpo en BBCode/Markdown estilo Mediavida (Épica 2):
 *  - Cabecera visual.
 *  - Ficha (lanzamiento, plataformas, géneros, desarrolladora, distribuidora, web, tiendas).
 *  - Descripción **en español** (Steam si disponible, RAWG en otro caso).
 *  - Capturas (Steam si disponible, RAWG en otro caso).
 */
export function buildJuegosThreadDraft(detail: RawgGameDetail, options: BuildThreadOptions = {}): ThreadDraft {
  const { storeUrls = {}, steam } = options

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

  // --- Capturas: Steam tiene prioridad por calidad. ---
  const steamShots = steam?.screenshots ?? []
  const rawgShots = (detail.short_screenshots ?? [])
    .map(s => s.image)
    .filter((url): url is string => typeof url === 'string' && url.trim() !== '')
  const shots = (steamShots.length > 0 ? steamShots : rawgShots).slice(0, 6)
  const shotsBlock = shots.length > 0 ? `\n## Capturas\n\n${shots.map(mvImg).join('\n\n')}\n` : ''

  const body = `${headerBlock}## Ficha\n\n${meta}\n\n## Descripción\n\n${desc}${descNote}${shotsBlock}`

  return { title, body, category: inferMediavidaJuegosCategory(detail) }
}
