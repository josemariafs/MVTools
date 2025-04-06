import browser from 'webextension-polyfill'
import type { ZodSchema } from 'zod'

import {
  BROWSER_STORAGE_KEYS,
  type BrowserStorageKey,
  type GlobalConfig,
  globalConfigSchema,
  type StylesConfig,
  stylesConfigSchema
} from '@/services/config'
import { devLog } from '@/utils/logging'

interface StorageSetupParams<T> {
  storageKey: BrowserStorageKey
  schema: ZodSchema<T>
  logPrefix: string
  onChangeCb: (config: T) => void
}

const setupStorageListener = <T>({ storageKey, schema, logPrefix, onChangeCb }: StorageSetupParams<T>) => {
  browser.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'sync' || !changes[storageKey]) return

    const { newValue } = changes[storageKey]
    const validationResult = schema.safeParse(newValue)
    if (!validationResult.success) {
      devLog.error(`Invalid ${logPrefix.toLowerCase()} data received from storage change:`, validationResult.error)
      return
    }

    const validData = validationResult.data
    devLog.log(`${logPrefix} updated via listener:`, validData)
    onChangeCb(validData)
  })
}

export const listenGlobalConfigChanges = (onChangeCb: (globalConfig: GlobalConfig) => void) => {
  setupStorageListener<GlobalConfig>({
    storageKey: BROWSER_STORAGE_KEYS.GLOBAL_CONFIG,
    schema: globalConfigSchema,
    logPrefix: 'Global config',
    onChangeCb
  })
}

export const listenStylesConfigChanges = (onChangeCb: (stylesConfig: StylesConfig) => void) => {
  setupStorageListener<StylesConfig>({
    storageKey: BROWSER_STORAGE_KEYS.STYLES_CONFIG,
    schema: stylesConfigSchema,
    logPrefix: 'Styles config',
    onChangeCb
  })
}
