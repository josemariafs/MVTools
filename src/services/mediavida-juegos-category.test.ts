import { describe, expect, it } from 'vitest'

import { inferMediavidaJuegosCategory, MEDIAVIDA_JUEGOS_FORUM_CATEGORY } from '@/services/mediavida-juegos-category'
import type { RawgGameDetail } from '@/types/rawg'

const C = MEDIAVIDA_JUEGOS_FORUM_CATEGORY

describe('inferMediavidaJuegosCategory', () => {
  it('PC + PlayStation + Xbox → Multiplataforma', () => {
    const d: RawgGameDetail = {
      id: 1,
      name: 'X',
      platforms: [{ platform: { name: 'PC' } }, { platform: { name: 'Xbox One' } }, { platform: { name: 'PlayStation 5' } }]
    }
    expect(inferMediavidaJuegosCategory(d)).toBe(C.MULTI)
  })

  it('sólo PC', () => {
    const d: RawgGameDetail = { id: 1, name: 'X', platforms: [{ platform: { name: 'PC', slug: 'pc' } }] }
    expect(inferMediavidaJuegosCategory(d)).toBe(C.PC)
  })

  it('sólo PlayStation 5', () => {
    const d: RawgGameDetail = {
      id: 1,
      name: 'X',
      platforms: [{ platform: { name: 'PlayStation 5', slug: 'playstation5' } }]
    }
    expect(inferMediavidaJuegosCategory(d)).toBe(C.PLAYSTATION_5)
  })

  it('sólo PlayStation 4 (sin 5 en nombre)', () => {
    const d: RawgGameDetail = {
      id: 1,
      name: 'X',
      platforms: [{ platform: { name: 'PlayStation 4', slug: 'playstation4' } }]
    }
    expect(inferMediavidaJuegosCategory(d)).toBe(C.PLAYSTATION)
  })

  it('Xbox One → Xbox', () => {
    const d: RawgGameDetail = {
      id: 1,
      name: 'X',
      platforms: [{ platform: { name: 'Xbox One', slug: 'xbox-one' } }]
    }
    expect(inferMediavidaJuegosCategory(d)).toBe(C.XBOX)
  })

  it('Xbox One X no cuenta como Xbox Series', () => {
    const d: RawgGameDetail = {
      id: 1,
      name: 'X',
      platforms: [{ platform: { name: 'Xbox One X', slug: 'xbox-one-x' } }]
    }
    expect(inferMediavidaJuegosCategory(d)).toBe(C.XBOX)
  })

  it('Xbox Series → Xbox Series X', () => {
    const d: RawgGameDetail = {
      id: 1,
      name: 'X',
      platforms: [{ platform: { name: 'Xbox Series X', slug: 'xbox-series-x' } }]
    }
    expect(inferMediavidaJuegosCategory(d)).toBe(C.XBOX_SERIES)
  })

  it('Nintendo', () => {
    const d: RawgGameDetail = {
      id: 1,
      name: 'X',
      platforms: [{ platform: { name: 'Nintendo Switch', slug: 'nintendo-switch' } }]
    }
    expect(inferMediavidaJuegosCategory(d)).toBe(C.NINTENDO)
  })

  it('sin plataformas → Otras', () => {
    const d: RawgGameDetail = { id: 1, name: 'X' }
    expect(inferMediavidaJuegosCategory(d)).toBe(C.OTRAS)
  })
})
