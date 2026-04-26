import { describe, expect, it } from 'vitest'

import { extractSteamAppIdFromUrl } from '@/services/steam-store'

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
