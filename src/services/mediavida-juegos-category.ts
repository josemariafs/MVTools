import type { RawgGameDetail } from '@/types/rawg'

/**
 * Etiquetas del `<select id="tag">` en /foro/juegos/nuevo-hilo (Mediavida).
 * Deben coincidir con el texto visible de las `<option>`.
 */
export const MEDIAVIDA_JUEGOS_FORUM_CATEGORY = {
  MULTI: 'Multiplataforma',
  PC: 'PC',
  PLAYSTATION: 'PlayStation',
  PLAYSTATION_5: 'PlayStation 5',
  XBOX: 'Xbox',
  XBOX_SERIES: 'Xbox Series X',
  NINTENDO: 'Nintendo',
  OTRAS: 'Otras'
} as const

type CoreFamily = 'pc' | 'playstation' | 'xbox' | 'nintendo'

interface Entry {
  slug: string
  name: string
}

function asEntries(detail: RawgGameDetail): Entry[] {
  const fromPlats = (detail.platforms ?? [])
    .map(p => ({
      slug: (p.platform?.slug ?? '').toLowerCase(),
      name: (p.platform?.name ?? '').toLowerCase()
    }))
    .filter(e => e.slug || e.name)

  if (fromPlats.length > 0) return fromPlats

  const pp = detail.parent_platforms ?? []
  return pp
    .map(p => ({
      slug: (p.platform?.slug ?? '').toLowerCase(),
      name: (p.platform?.name ?? '').toLowerCase()
    }))
    .filter(e => e.slug || e.name)
}

function haystack(e: Entry): string {
  return `${e.slug} ${e.name}`
}

function isMobileOnly(e: Entry): boolean {
  const h = haystack(e)
  return e.slug === 'android' || e.slug === 'ios' || /\bandroid\b|\bios\b|iphone|ipad/i.test(h)
}

function isPC(e: Entry): boolean {
  const h = haystack(e)
  if (e.slug === 'pc' || e.slug === 'linux' || e.slug === 'mac') return true
  if (/\bpc\b|windows|macos|linux|steam os/.test(h)) return true
  return false
}

function isPlaystation(e: Entry): boolean {
  const h = haystack(e)
  return e.slug.includes('playstation') || /\bplaystation\b|\bps[0-9]|\bps5|\bps4|\bps3|\bps vita|\bpsp\b/i.test(h)
}

function isPlaystation5(e: Entry): boolean {
  const h = haystack(e)
  if (/\bps5\b|playstation\s*5|playstation5|playstation-5/i.test(h)) return true
  if (e.slug.includes('playstation-5') || e.slug.includes('ps5')) return true
  return false
}

function isXbox(e: Entry): boolean {
  const h = haystack(e)
  return e.slug.includes('xbox') || /\bxbox\b/i.test(h)
}

function isXboxSeries(e: Entry): boolean {
  const h = haystack(e)
  /** "Xbox One X" (gen. One) no debe mapear a subforo "Xbox Series X". */
  if (/\bxbox one\b/i.test(h) && !/xbox series/i.test(h)) return false
  if (e.slug.startsWith('xbox-series') || e.slug === 'xbox-scarlett') return true
  if (/\bxbox series\s*(x|s)\b|series\s*(x|s)\b.*\bxbox/i.test(h)) return true
  if (/scarlett/i.test(h) && e.slug.includes('xbox')) return true
  return false
}

function isNintendo(e: Entry): boolean {
  const h = haystack(e)
  if (e.slug.includes('nintendo')) return true
  if (/\bnintendo|switch|wii|3ds|game ?boy/i.test(h)) return true
  return false
}

/**
 * Categoría del foro Juegos (texto de `<option>`) según plataformas del juego.
 * Multiformato (≥2 familias entre PC/PS/Xbox/Nintendo) → `Multiplataforma`.
 * Sólo móvil o sin datos reconocibles → `Otras`.
 */
export function inferMediavidaJuegosCategory(detail: RawgGameDetail): string {
  const entries = asEntries(detail)
  if (entries.length === 0) {
    return MEDIAVIDA_JUEGOS_FORUM_CATEGORY.OTRAS
  }

  const allMobile = entries.length > 0 && entries.every(isMobileOnly)
  if (allMobile) {
    return MEDIAVIDA_JUEGOS_FORUM_CATEGORY.OTRAS
  }

  const nonMobile = entries.filter(e => !isMobileOnly(e))
  if (nonMobile.length === 0) {
    return MEDIAVIDA_JUEGOS_FORUM_CATEGORY.OTRAS
  }

  const families = new Set<CoreFamily>()

  let anyPS5 = false
  let anyXSeries = false

  for (const e of nonMobile) {
    // Entradas independientes: una plataforma no excluye otra en el mismo juego.
    if (isNintendo(e)) families.add('nintendo')
    if (isPC(e)) families.add('pc')
    if (isPlaystation(e)) {
      families.add('playstation')
      if (isPlaystation5(e)) anyPS5 = true
    }
    if (isXbox(e)) {
      families.add('xbox')
      if (isXboxSeries(e)) anyXSeries = true
    }
  }

  const core = [...families]
  if (core.length >= 2) {
    return MEDIAVIDA_JUEGOS_FORUM_CATEGORY.MULTI
  }
  if (core.length === 0) {
    return MEDIAVIDA_JUEGOS_FORUM_CATEGORY.OTRAS
  }

  const only = core[0]!
  if (only === 'pc') return MEDIAVIDA_JUEGOS_FORUM_CATEGORY.PC
  if (only === 'nintendo') return MEDIAVIDA_JUEGOS_FORUM_CATEGORY.NINTENDO
  if (only === 'playstation') {
    if (anyPS5) return MEDIAVIDA_JUEGOS_FORUM_CATEGORY.PLAYSTATION_5
    for (const e of nonMobile) {
      if (isPlaystation(e) && isPlaystation5(e)) {
        return MEDIAVIDA_JUEGOS_FORUM_CATEGORY.PLAYSTATION_5
      }
    }
    return MEDIAVIDA_JUEGOS_FORUM_CATEGORY.PLAYSTATION
  }
  if (only === 'xbox') {
    if (anyXSeries) return MEDIAVIDA_JUEGOS_FORUM_CATEGORY.XBOX_SERIES
    for (const e of nonMobile) {
      if (isXbox(e) && isXboxSeries(e)) {
        return MEDIAVIDA_JUEGOS_FORUM_CATEGORY.XBOX_SERIES
      }
    }
    return MEDIAVIDA_JUEGOS_FORUM_CATEGORY.XBOX
  }
  return MEDIAVIDA_JUEGOS_FORUM_CATEGORY.OTRAS
}
