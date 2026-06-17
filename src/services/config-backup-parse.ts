import { z } from 'zod'

import { globalConfigSchema, stylesConfigSchema } from '@/services/config'
import { upgradeTasksSchema } from '@/services/upgrades'
import { BROWSER_STORAGE_KEYS } from '@/types/storage'

export const BACKUP_FORMAT_VERSION = 1 as const

export const SYNC_BACKUP_KEYS = [
  BROWSER_STORAGE_KEYS.STYLES_CONFIG,
  BROWSER_STORAGE_KEYS.GLOBAL_CONFIG,
  BROWSER_STORAGE_KEYS.PERFORMED_UPGRADE_TASKS,
  BROWSER_STORAGE_KEYS.EXTENSION_MIGRATED_FROM_VERSION,
  BROWSER_STORAGE_KEYS.USER_PREFERENCES
] as const

export const LOCAL_BACKUP_KEYS = [
  BROWSER_STORAGE_KEYS.RAWG_UPCOMING_CACHE,
  BROWSER_STORAGE_KEYS.PENDING_JUEGOS_THREAD,
  BROWSER_STORAGE_KEYS.RELEASE_DAY_NOTIFIED_BY_YMD
] as const

const userPreferencesSchema = z.object({
  markersListMode: z.boolean()
})

const backupPayloadSchema = z.object({
  version: z.literal(BACKUP_FORMAT_VERSION),
  extensionVersion: z.string(),
  exportedAt: z.string(),
  sync: z.record(z.string(), z.unknown()),
  local: z.record(z.string(), z.unknown())
})

const backupFileSchema = z.object({
  mvtoolsBackup: backupPayloadSchema
})

export type MvtoolsBackupPayload = z.infer<typeof backupPayloadSchema>

export type ValidatedMvtoolsBackup = MvtoolsBackupPayload & {
  sync: Partial<Record<(typeof SYNC_BACKUP_KEYS)[number], unknown>>
  local: Partial<Record<(typeof LOCAL_BACKUP_KEYS)[number], unknown>>
}

const validateSyncEntry = (key: (typeof SYNC_BACKUP_KEYS)[number], value: unknown): unknown => {
  switch (key) {
    case BROWSER_STORAGE_KEYS.GLOBAL_CONFIG:
      return globalConfigSchema.parse(value)
    case BROWSER_STORAGE_KEYS.STYLES_CONFIG:
      return stylesConfigSchema.parse(value)
    case BROWSER_STORAGE_KEYS.PERFORMED_UPGRADE_TASKS:
      return upgradeTasksSchema.parse(value)
    case BROWSER_STORAGE_KEYS.USER_PREFERENCES:
      return userPreferencesSchema.parse(value)
    case BROWSER_STORAGE_KEYS.EXTENSION_MIGRATED_FROM_VERSION:
      return z.string().parse(value)
    default:
      throw new Error(`Clave sync desconocida: ${key satisfies never}`)
  }
}

export const parseMvtoolsBackupFile = (raw: unknown): ValidatedMvtoolsBackup => {
  const parsed = backupFileSchema.parse(raw)
  const sync: ValidatedMvtoolsBackup['sync'] = {}
  const local: ValidatedMvtoolsBackup['local'] = {}

  for (const key of SYNC_BACKUP_KEYS) {
    const value = parsed.mvtoolsBackup.sync[key]
    if (value !== undefined) {
      sync[key] = validateSyncEntry(key, value)
    }
  }

  for (const key of LOCAL_BACKUP_KEYS) {
    const value = parsed.mvtoolsBackup.local[key]
    if (value !== undefined) {
      local[key] = value
    }
  }

  if (Object.keys(sync).length === 0 && Object.keys(local).length === 0) {
    throw new Error('El archivo no contiene datos de MVTools para restaurar.')
  }

  return {
    ...parsed.mvtoolsBackup,
    sync,
    local
  }
}

export const formatBackupImportSummary = (backup: ValidatedMvtoolsBackup): string => {
  const syncCount = Object.keys(backup.sync).length
  const localCount = Object.keys(backup.local).length
  const exportedAt = new Date(backup.exportedAt)
  const dateLabel = Number.isNaN(exportedAt.getTime()) ? backup.exportedAt : exportedAt.toLocaleString('es-ES')

  return `Copia del ${dateLabel} (ext. v${backup.extensionVersion}). Se restaurarán ${syncCount} claves sync y ${localCount} claves locales.`
}

export const downloadBackupJson = (data: { mvtoolsBackup: MvtoolsBackupPayload }): void => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `mvtools-backup-${new Date().toISOString().slice(0, 10)}.json`
  anchor.click()
  URL.revokeObjectURL(url)
}

export const readJsonFile = (file: File): Promise<unknown> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        resolve(JSON.parse(String(reader.result)))
      } catch {
        reject(new Error('El archivo no es un JSON válido.'))
      }
    }
    reader.onerror = () => reject(new Error('No se pudo leer el archivo.'))
    reader.readAsText(file)
  })
