import browser from 'webextension-polyfill'

import {
  BACKUP_FORMAT_VERSION,
  LOCAL_BACKUP_KEYS,
  type MvtoolsBackupPayload,
  SYNC_BACKUP_KEYS,
  type ValidatedMvtoolsBackup
} from '@/services/config-backup-parse'

import pkg from '../../package.json'

export {
  BACKUP_FORMAT_VERSION,
  downloadBackupJson,
  formatBackupImportSummary,
  LOCAL_BACKUP_KEYS,
  parseMvtoolsBackupFile,
  readJsonFile,
  SYNC_BACKUP_KEYS,
  type MvtoolsBackupPayload,
  type ValidatedMvtoolsBackup
} from '@/services/config-backup-parse'

export const exportMvtoolsBackup = async (): Promise<{ mvtoolsBackup: MvtoolsBackupPayload }> => {
  const sync = await browser.storage.sync.get([...SYNC_BACKUP_KEYS])
  const local = await browser.storage.local.get([...LOCAL_BACKUP_KEYS])

  return {
    mvtoolsBackup: {
      version: BACKUP_FORMAT_VERSION,
      extensionVersion: pkg.version,
      exportedAt: new Date().toISOString(),
      sync,
      local
    }
  }
}

export const importMvtoolsBackup = async (backup: ValidatedMvtoolsBackup): Promise<void> => {
  if (Object.keys(backup.sync).length > 0) {
    await browser.storage.sync.set(backup.sync)
  }
  if (Object.keys(backup.local).length > 0) {
    await browser.storage.local.set(backup.local)
  }
}
