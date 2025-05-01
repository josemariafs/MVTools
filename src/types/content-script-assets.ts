// Do not use import aliases (aside from types) in this file, as it will break the build process
import type { AdditionalInput } from '@samrum/vite-plugin-web-extension'

import type { GlobalConfig, StylesConfig } from '@/services/config'
import type { Deal } from '@/types/event-messages'

import { ALLOWED_URLS } from '../constants'

const SCRIPT_FILES_BASE_PATH = 'src/entries/contentScript/injected'

export interface ScriptArgObjects {
  MIGRATE_FROM_LOCAL_STORAGE: {
    globalConfig: GlobalConfig
    stylesConfig: StylesConfig
  }
  FILL_NEW_DEAL_THREAD: {
    deal: Deal
  }
}

export type ScriptKey = keyof ScriptArgObjects

export interface ScriptFileObject<T extends ScriptKey> {
  id: T
  path: string
  extension: string
  matches: string[]
}

type ScriptRegistry = { [K in ScriptKey]: ScriptFileObject<K> }

export const SCRIPT_FILES = {
  MIGRATE_FROM_LOCAL_STORAGE: {
    id: 'MIGRATE_FROM_LOCAL_STORAGE',
    path: `${SCRIPT_FILES_BASE_PATH}/migrate-from-local-storage`,
    extension: 'ts',
    matches: [ALLOWED_URLS.MEDIAVIDA]
  },
  FILL_NEW_DEAL_THREAD: {
    id: 'FILL_NEW_DEAL_THREAD',
    path: `${SCRIPT_FILES_BASE_PATH}/fill-new-deal-thread`,
    extension: 'ts',
    matches: [ALLOWED_URLS.MEDIAVIDA]
  }
} as const satisfies ScriptRegistry

export const scriptFilePaths: AdditionalInput[] = Object.values(SCRIPT_FILES).map(({ path, extension, matches }) => ({
  fileName: `${path}.${extension}`,
  webAccessible: { matches }
}))
