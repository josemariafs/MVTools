import { type GlobalConfig, globalConfigSchema, type StylesConfig, stylesConfigSchema } from '@/services/config'
import { BROWSER_STORAGE_KEYS } from '@/types/storage'
import { setupStorageListener } from '@/utils/storage'

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
