import { describe, expect, it } from 'vitest'

import {
  extractSteamAppIdFromUrl,
  normalizeGameTitleForMatch,
  pickSteamAppIdFromSearchResults,
  type SteamStoreSearchItem
} from '@/services/steam-store'

describe('normalizeGameTitleForMatch', () => {
  it('unifica & con and y quita puntuación', () => {
    expect(normalizeGameTitleForMatch('Heroes of Might & Magic: Olden Era')).toBe(
      normalizeGameTitleForMatch('Heroes of Might and Magic: Olden Era')
    )
  })
})

describe('pickSteamAppIdFromSearchResults', () => {
  const itemsHeroes: SteamStoreSearchItem[] = [
    { type: 'app', id: 3105440, name: 'Heroes of Might and Magic: Olden Era' },
    { type: 'app', id: 297000, name: 'Heroes® of Might & Magic® III - HD Edition' },
    { type: 'app', id: 3241970, name: 'Heroes of Might and Magic: Olden Era Demo' }
  ]

  it('coincide el juego principal y descarta demo si RAWG no es demo', () => {
    expect(pickSteamAppIdFromSearchResults('Heroes of Might & Magic: Olden Era', itemsHeroes)).toBe(3105440)
  })

  it('permite demo cuando el título RAWG lo indica', () => {
    expect(
      pickSteamAppIdFromSearchResults('Heroes of Might and Magic: Olden Era Demo', itemsHeroes)
    ).toBe(3241970)
  })

  it('devuelve null si no hay coincidencia segura', () => {
    expect(pickSteamAppIdFromSearchResults('Totally Unrelated RPG XII', itemsHeroes)).toBeNull()
  })
})

describe('extractSteamAppIdFromUrl', () => {
  it('extrae el AppID de URLs canónicas', () => {
    expect(extractSteamAppIdFromUrl('https://store.steampowered.com/app/12345/Aphelion/')).toBe(12345)
    expect(extractSteamAppIdFromUrl('https://store.steampowered.com/app/9876')).toBe(9876)
    expect(extractSteamAppIdFromUrl('http://store.steampowered.com/app/1?utm_source=x')).toBe(1)
  })

  it('devuelve null para URLs no Steam o malformadas', () => {
    expect(extractSteamAppIdFromUrl(null)).toBeNull()
    expect(extractSteamAppIdFromUrl(undefined)).toBeNull()
    expect(extractSteamAppIdFromUrl('https://store.steampowered.com/sub/12345/')).toBeNull()
    expect(extractSteamAppIdFromUrl('https://example.com/app/1')).toBeNull()
    expect(extractSteamAppIdFromUrl('https://store.steampowered.com/app/abc')).toBeNull()
  })
})
