import { describe, expect, it } from 'vitest'

import {
  buildUpcomingReleasesDateRangeKeys,
  filterNotNotified,
  getGamesReleasingOnDay,
  getLocalYmd,
  isRawgUpcomingCacheFresh,
  RAWG_UPCOMING_CACHE_TTL_MS
} from '@/services/rawg-helpers'
import type { RawgUpcomingCache } from '@/types/rawg'

describe('buildUpcomingReleasesDateRangeKeys', () => {
  it('usa ventana hoy a hoy+30 (string YYYY-MM-DD para RAWG)', () => {
    const now = new Date(2026, 3, 26, 12, 0, 0, 0)
    const { start, end, dateRangeKey } = buildUpcomingReleasesDateRangeKeys(now)
    expect(start).toBe('2026-04-26')
    expect(end).toBe('2026-05-26')
    expect(dateRangeKey).toBe('2026-04-26,2026-05-26')
  })
})

describe('isRawgUpcomingCacheFresh', () => {
  it('devuelve true dentro del TTL', () => {
    const t = 1_000_000
    expect(isRawgUpcomingCacheFresh({ dateRangeKey: 'a,b', fetchedAt: t, games: [] }, t + RAWG_UPCOMING_CACHE_TTL_MS - 1)).toBe(true)
  })
  it('devuelve false al superar el TTL', () => {
    const t = 1_000_000
    expect(isRawgUpcomingCacheFresh({ dateRangeKey: 'a,b', fetchedAt: t, games: [] }, t + RAWG_UPCOMING_CACHE_TTL_MS + 1)).toBe(false)
  })
})

describe('getLocalYmd / getGamesReleasingOnDay (Ép. 3)', () => {
  it('getLocalYmd devuelve YYYY-MM-DD', () => {
    const s = getLocalYmd(new Date(2026, 3, 26))
    expect(s).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('filtra por día local YYYY-MM-DD', () => {
    const cache: RawgUpcomingCache = {
      dateRangeKey: 'a,b',
      fetchedAt: 0,
      games: [
        { id: 1, name: 'A', released: '2026-04-26T00:00:00' },
        { id: 2, name: 'B', released: '2026-05-01' }
      ]
    }
    expect(getGamesReleasingOnDay(cache, '2026-04-26')).toHaveLength(1)
    expect(getGamesReleasingOnDay(cache, '2026-05-01')[0]?.name).toBe('B')
  })
})

describe('filterNotNotified', () => {
  it('excluye ids ya en el mapa del día', () => {
    const games = [{ id: 1, name: 'A', released: '2026-04-26' }]
    const r = filterNotNotified('2026-04-26', games, { '2026-04-26': [1] })
    expect(r).toHaveLength(0)
  })
})
