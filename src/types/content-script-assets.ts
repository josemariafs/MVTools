import type { GlobalConfig, StylesConfig } from '@/services/config'
import type { InjectDealScriptPayload } from '@/types/event-messages'

const SCRIPT_FILES_BASE_PATH = 'src/entries/contentScript/injected'

export interface ScriptArgObjects {
  MIGRATE_FROM_LOCAL_STORAGE: {
    globalConfig: GlobalConfig
    stylesConfig: StylesConfig
  }
  FILL_NEW_DEAL_THREAD: {
    deal: InjectDealScriptPayload['deal']
  }
}

export type ScriptKey = keyof ScriptArgObjects

export interface ScriptFileObject<T extends ScriptKey> {
  id: T
  path: string
  extension: string
}

type ScriptRegistry = { [K in ScriptKey]: ScriptFileObject<K> }

export const SCRIPT_FILES = {
  MIGRATE_FROM_LOCAL_STORAGE: {
    id: 'MIGRATE_FROM_LOCAL_STORAGE',
    path: `${SCRIPT_FILES_BASE_PATH}/migrate-from-local-storage`,
    extension: 'ts'
  },
  FILL_NEW_DEAL_THREAD: {
    id: 'FILL_NEW_DEAL_THREAD',
    path: `${SCRIPT_FILES_BASE_PATH}/fill-new-deal-thread`,
    extension: 'ts'
  }
} as const satisfies ScriptRegistry

export const scriptFilePaths = Object.values(SCRIPT_FILES).map(({ path, extension }) => `${path}.${extension}`)
