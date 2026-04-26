import { describe, expect, it } from 'vitest'

import {
  buildJuegosThreadDraft,
  buildStoreLinks,
  formatReleaseDayMonthForTitle,
  mvImg,
  mvUrl,
  stripHtmlToText
} from '@/services/rawg-thread-markdown'
import type { SteamGameInfo } from '@/services/steam-store'
import type { RawgGameDetail } from '@/types/rawg'

describe('helpers BBCode', () => {
  it('mvImg', () => {
    expect(mvImg('https://a.com/1.png')).toBe('[img]https://a.com/1.png[/img]')
  })
  it('mvUrl', () => {
    expect(mvUrl('https://x', 'Y')).toBe('[url=https://x]Y[/url]')
    expect(mvUrl('', 'Y')).toBe('')
    expect(mvUrl('https://x', '')).toBe('')
  })
  it('quita marcas HTML básicas sin DOM', () => {
    expect(stripHtmlToText('<p>Hola <b>MV</b></p>')).toBe('Hola MV')
  })
})

describe('buildStoreLinks', () => {
  const baseDetail = (): RawgGameDetail => ({
    id: 1,
    name: 'X',
    stores: [
      { store: { id: 1, name: 'Steam' }, store_id: 1 },
      { store: { id: 11, name: 'Epic' }, store_id: 11 },
      { store: { id: 5, name: 'GOG' }, store_id: 5 },
      // Otra tienda no permitida — debe ignorarse.
      { store: { id: 3, name: 'PSN' }, store_id: 3 }
    ]
  })

  it('orden Steam → Epic → GOG y sólo allowlist', () => {
    const links = buildStoreLinks(baseDetail(), {
      1: 'https://store.steampowered.com/app/1',
      5: 'https://www.gog.com/game/x',
      11: 'https://store.epicgames.com/p/x',
      3: 'https://store.playstation.com/x'
    })
    expect(links).toHaveLength(3)
    expect(links[0]).toContain('Steam')
    expect(links[1]).toContain('Epic')
    expect(links[2]).toContain('GOG')
  })

  it('descarta tiendas sin URL real (la URL de RAWG no se usa si no es http(s) absoluta válida)', () => {
    const links = buildStoreLinks({ ...baseDetail(), stores: [{ store: { id: 1 }, store_id: 1 }] }, {})
    expect(links).toHaveLength(0)
  })
})

describe('formatReleaseDayMonthForTitle', () => {
  it('convierte YYYY-MM-DD a DD-MM', () => {
    expect(formatReleaseDayMonthForTitle('2026-04-26')).toBe('26-04')
    expect(formatReleaseDayMonthForTitle('2026-12-01')).toBe('01-12')
  })
  it('sin fecha o inválida → N/D', () => {
    expect(formatReleaseDayMonthForTitle(null)).toBe('N/D')
    expect(formatReleaseDayMonthForTitle('')).toBe('N/D')
  })
})

describe('buildJuegosThreadDraft', () => {
  it('ficha con Steam: usa descripción ES y capturas Steam, sin footer MVTools', () => {
    const detail: RawgGameDetail = {
      id: 1,
      name: 'Aphelion',
      description: '<p>English desc</p>',
      released: '2026-04-26',
      background_image: 'https://x/bg.jpg',
      short_screenshots: [{ id: 1, image: 'https://x/rawg-shot.png' }],
      website: 'https://aphelion.example',
      platforms: [{ platform: { name: 'PC' } }, { platform: { name: 'PS5' } }, { platform: { name: 'Xbox One' } }],
      developers: [{ name: 'Studio Foo' }],
      publishers: [{ name: 'Publisher Bar' }],
      genres: [{ name: 'Aventura' }],
      stores: [{ store: { id: 1 }, store_id: 1 }]
    }
    const steam: SteamGameInfo = {
      appId: 12345,
      name: 'Aphelion',
      shortDescription: 'Aventura espacial en español.',
      headerImage: 'https://cdn.steam/header.jpg',
      storeUrl: 'https://store.steampowered.com/app/12345/',
      screenshots: ['https://cdn.steam/s1.jpg', 'https://cdn.steam/s2.jpg']
    }
    const d = buildJuegosThreadDraft(detail, {
      storeUrls: { 1: 'https://store.steampowered.com/app/12345/' },
      steam
    })

    expect(d.title).toBe('Aphelion | Lanzamiento 26-04')
    expect(d.category).toBe('Multiplataforma')
    expect(d.body.startsWith('# Aphelion\n\n')).toBe(true)
    // Cabecera usa header de Steam si está presente.
    expect(d.body).toContain(mvImg('https://cdn.steam/header.jpg'))
    // Ficha completa.
    expect(d.body).toContain('**Lanzamiento:** 2026-04-26')
    expect(d.body).toContain('**Plataformas:** PC, PS5')
    expect(d.body).toContain('**Géneros:** Aventura')
    expect(d.body).toContain('**Desarrolladora:** Studio Foo')
    expect(d.body).toContain('**Distribuidora:** Publisher Bar')
    expect(d.body).toContain('**Web oficial:** https://aphelion.example')
    expect(d.body).toContain('[url=https://store.steampowered.com/app/12345/]Steam[/url]')
    // Descripción ES y capturas de Steam.
    expect(d.body).toContain('Aventura espacial en español.')
    expect(d.body).toContain(mvImg('https://cdn.steam/s1.jpg'))
    expect(d.body).toContain(mvImg('https://cdn.steam/s2.jpg'))
    // Sin capturas RAWG cuando hay Steam.
    expect(d.body).not.toContain('rawg-shot')
    // Sin footer MVTools.
    expect(d.body).not.toMatch(/MVTools|Ficha generada/i)
  })

  it('sin Steam: usa capturas RAWG y avisa de que la descripción está en inglés', () => {
    const detail: RawgGameDetail = {
      id: 2,
      name: 'Solo RAWG',
      description: '<p>English desc</p>',
      released: '2026-12-01',
      background_image: 'https://x/bg.jpg',
      short_screenshots: [{ id: 1, image: 'https://x/r1.png' }],
      platforms: [{ platform: { name: 'PC' } }],
      developers: [{ name: 'Solo Dev' }]
    }
    const d = buildJuegosThreadDraft(detail)

    expect(d.title).toBe('Solo RAWG | Lanzamiento 01-12')
    expect(d.category).toBe('PC')
    expect(d.body).toContain(mvImg('https://x/r1.png'))
    expect(d.body).toContain('English desc')
    expect(d.body).toContain('original en inglés')
    // Sin distribuidora si coincide con desarrolladora o no hay.
    expect(d.body).not.toContain('**Distribuidora:**')
  })

  it('sin desarrolladora ni descripción: ficha mínima sin romper', () => {
    const detail: RawgGameDetail = { id: 3, name: 'Vacío' }
    const d = buildJuegosThreadDraft(detail)
    expect(d.title).toBe('Vacío | Lanzamiento N/D')
    expect(d.category).toBe('Otras')
    expect(d.body).toContain('**Lanzamiento:** Sin fecha confirmada')
    expect(d.body).toContain('Sin descripción disponible.')
    expect(d.body).not.toContain('**Plataformas:**')
  })
})
