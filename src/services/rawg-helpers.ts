import type { RawgGameListItem, RawgUpcomingCache } from '@/types/rawg'

/** 1 h — Story 1.3 (TTL) */
export const RAWG_UPCOMING_CACHE_TTL_MS = 60 * 60 * 1000

function formatLocalYmd(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Día local en formato YYYY-MM-DD (avisos/RAWG, Ép. 3). */
export function getLocalYmd(d: Date = new Date()): string {
  return formatLocalYmd(d)
}

function releaseYmdFromRawg(released: string | null | undefined): string | null {
  if (!released?.trim()) return null
  return released.slice(0, 10)
}

/**
 * Juegos cuya fecha de estreno (local, día) coincide con `dayYmd` (formato YYYY-MM-DD).
 */
export function getGamesReleasingOnDay(cached: RawgUpcomingCache, dayYmd: string): RawgGameListItem[] {
  return cached.games.filter(g => {
    const ymd = releaseYmdFromRawg(g.released)
    return ymd === dayYmd
  })
}

export type NotifiedByYmd = Record<string, number[]>

export function filterNotNotified(todayYmd: string, games: RawgGameListItem[], already: NotifiedByYmd): RawgGameListItem[] {
  const was = new Set(already[todayYmd] ?? [])
  return games.filter(g => !was.has(g.id))
}

function toDate(input: Date | number | undefined): Date {
  if (input === undefined) return new Date()
  return typeof input === 'number' ? new Date(input) : input
}

/**
 * Rango de fechas locales [hoy, hoy+30] para el parámetro `dates` de RAWG.
 */
export function buildUpcomingReleasesDateRangeKeys(nowInput?: Date | number): { start: string; end: string; dateRangeKey: string } {
  const start = toDate(nowInput)
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(end.getDate() + 30)
  const startStr = formatLocalYmd(start)
  const endStr = formatLocalYmd(end)
  return { start: startStr, end: endStr, dateRangeKey: `${startStr},${endStr}` }
}

export function isRawgUpcomingCacheFresh(cache: RawgUpcomingCache, now: number): boolean {
  return now - cache.fetchedAt < RAWG_UPCOMING_CACHE_TTL_MS
}

export function groupGamesByReleaseDate(games: RawgGameListItem[]): Map<string, RawgGameListItem[]> {
  const map = new Map<string, RawgGameListItem[]>()
  for (const g of games) {
    if (!g.released) continue
    const day = g.released.slice(0, 10)
    const list = map.get(day) ?? []
    list.push(g)
    map.set(day, list)
  }
  return map
}
