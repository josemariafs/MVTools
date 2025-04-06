import browser from 'webextension-polyfill'
import type { ZodSchema } from 'zod'

import { STORAGE_KEYS, type StorageKey } from '@/constants'
import {
  getGlobalConfig,
  getStylesConfig,
  type GlobalConfig,
  globalConfigSchema,
  type StylesConfig,
  stylesConfigSchema
} from '@/services/config'
import { updateGlobalConfigStore } from '@/store/global-config-store'
import { devLog } from '@/utils/logging'

const setupStorageListener = <T>(storageKey: StorageKey, schema: ZodSchema<T>, logPrefix: string, onUpdate?: (data: T) => void) => {
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
    onUpdate?.(validData)
  })
}

interface ConfigSetupParams<T> {
  storageKey: StorageKey
  schema: ZodSchema<T>
  getConfigFn: () => Promise<T>
  logPrefix: string
  onChangeCb?: (config: T) => void
  updateStoreFn?: (config: T) => void
}

const setupConfigManagement = async <T>({
  storageKey,
  schema,
  getConfigFn,
  logPrefix,
  onChangeCb,
  updateStoreFn
}: ConfigSetupParams<T>): Promise<T> => {
  setupStorageListener(storageKey, schema, logPrefix, updatedData => {
    updateStoreFn?.(updatedData)
    onChangeCb?.(updatedData)
  })

  const initialConfig = await getConfigFn()
  devLog.log(`${logPrefix} initial state loaded:`, initialConfig)
  updateStoreFn?.(initialConfig)
  return initialConfig
}

export const updateAndListenGlobalConfigStore = (onChangeCb?: (globalConfig: GlobalConfig) => void) =>
  setupConfigManagement<GlobalConfig>({
    storageKey: STORAGE_KEYS.GLOBAL_CONFIG,
    schema: globalConfigSchema,
    getConfigFn: getGlobalConfig,
    logPrefix: 'Global config',
    updateStoreFn: updateGlobalConfigStore,
    onChangeCb
  })

export const getAndListenStylesConfigStore = (onChangeCb?: (stylesConfig: StylesConfig) => void) =>
  setupConfigManagement<StylesConfig>({
    storageKey: STORAGE_KEYS.STYLES_CONFIG,
    schema: stylesConfigSchema,
    getConfigFn: getStylesConfig,
    logPrefix: 'Styles config',
    onChangeCb
  })
