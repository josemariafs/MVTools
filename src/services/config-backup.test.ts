/**
 * @vitest-environment jsdom
 */
import { describe, expect, it, vi } from 'vitest'

vi.mock('webextension-polyfill', () => ({
  default: {
    storage: {
      sync: { get: vi.fn(), set: vi.fn() },
      local: { get: vi.fn(), set: vi.fn() }
    }
  }
}))

import { DEFAULT_GLOBAL_CONFIG } from '@/services/config'
import { parseMvtoolsBackupFile } from '@/services/config-backup-parse'
import { BROWSER_STORAGE_KEYS } from '@/types/storage'

describe('config-backup', () => {
  it('valida y extrae claves conocidas del backup', () => {
    const backup = parseMvtoolsBackupFile({
      mvtoolsBackup: {
        version: 1,
        extensionVersion: '3.2.1',
        exportedAt: '2026-06-17T12:00:00.000Z',
        sync: {
          [BROWSER_STORAGE_KEYS.GLOBAL_CONFIG]: {
            ...DEFAULT_GLOBAL_CONFIG,
            trackedCloneAccounts: [{ userId: '1', username: 'TestUser' }]
          },
          [BROWSER_STORAGE_KEYS.STYLES_CONFIG]: {
            premiumEnabled: true,
            premiumBgDisabled: false,
            ultraWideEnabled: false
          }
        },
        local: {
          [BROWSER_STORAGE_KEYS.PENDING_JUEGOS_THREAD]: { gameId: 42 }
        }
      }
    })

    expect(backup.sync[BROWSER_STORAGE_KEYS.GLOBAL_CONFIG]).toMatchObject({
      trackedCloneAccounts: [{ userId: '1', username: 'TestUser' }]
    })
    expect(backup.local[BROWSER_STORAGE_KEYS.PENDING_JUEGOS_THREAD]).toEqual({ gameId: 42 })
  })

  it('rechaza backups vacíos', () => {
    expect(() =>
      parseMvtoolsBackupFile({
        mvtoolsBackup: {
          version: 1,
          extensionVersion: '3.2.1',
          exportedAt: '2026-06-17T12:00:00.000Z',
          sync: {},
          local: {}
        }
      })
    ).toThrow(/no contiene datos/)
  })
})
