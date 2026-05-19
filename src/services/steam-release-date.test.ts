import { describe, expect, it } from 'vitest'

import { parseSteamReleaseDateToIso } from '@/services/steam-release-date'

describe('parseSteamReleaseDateToIso', () => {
  it('parsea fecha Steam en español', () => {
    expect(parseSteamReleaseDateToIso('30 ABR 2026')).toBe('2026-04-30')
    expect(parseSteamReleaseDateToIso('1 ENE 2025')).toBe('2025-01-01')
  })

  it('acepta punto tras el mes', () => {
    expect(parseSteamReleaseDateToIso('26 Nov. 2026')).toBe('2026-11-26')
  })

  it('parsea meses en inglés', () => {
    expect(parseSteamReleaseDateToIso('15 MAR 2024')).toBe('2024-03-15')
    expect(parseSteamReleaseDateToIso('20 DEC 2023')).toBe('2023-12-20')
  })

  it('devuelve null si no coincide el formato', () => {
    expect(parseSteamReleaseDateToIso('')).toBeNull()
    expect(parseSteamReleaseDateToIso('pronto')).toBeNull()
    expect(parseSteamReleaseDateToIso('2026-04-30')).toBeNull()
  })
})
