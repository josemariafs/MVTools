import { CSS_CLASS_NAMES, PATH_REGEXP, STORAGE_KEYS, type StorageKey } from '@/constants'
import { MODULES, renderApp } from '@/features/main'
import { globalConfigSchema, stylesConfigSchema } from '@/services/config'
import { updateGlobalConfigStore } from '@/store/global-config-store'
import { isUrlPath, objectEntries } from '@/utils/asserts'
import { toggleBodyClass } from '@/utils/dom'
import { devLog } from '@/utils/logging'

const { MV_PREMIUM, MV_PREMIUM_WITHOUT_BG, MV_ULTRA_WIDE } = CSS_CLASS_NAMES

const toggleStylesActions = (value: unknown, from: string) => {
  const validStylesConfig = stylesConfigSchema.safeParse(value)
  if (!validStylesConfig.success) return

  objectEntries(validStylesConfig.data).forEach(([key, value]) => {
    key === 'premiumEnabled' && toggleBodyClass(MV_PREMIUM, value)
    key === 'premiumBgDisabled' && toggleBodyClass(MV_PREMIUM_WITHOUT_BG, value)
    key === 'ultraWideEnabled' && toggleBodyClass(MV_ULTRA_WIDE, value)
  })
  devLog.log(`Styles config ${from}:`, validStylesConfig.data)
}

const updateGlobalConfigActions = (value: unknown) => {
  const validGlobalConfig = globalConfigSchema.safeParse(value)
  if (!validGlobalConfig.success) return

  updateGlobalConfigStore(validGlobalConfig.data)
  devLog.log('Global config updated:', validGlobalConfig.data)
}

const globalConfigActions = (value: unknown) => {
  const validGlobalConfig = globalConfigSchema.safeParse(value)
  if (!validGlobalConfig.success) return

  updateGlobalConfigStore(validGlobalConfig.data)

  if (isUrlPath(PATH_REGEXP.THREAD)) {
    devLog.log('Rendering Thread with:', validGlobalConfig.data)
    renderApp(MODULES.THREAD)
    return
  }

  if (isUrlPath(PATH_REGEXP.PRIVATE_MESSAGES)) {
    devLog.log('Rendering Private Messages with:', validGlobalConfig.data.ignoredUsers)
    renderApp(MODULES.PRIVATE_MESSAGES)
  }
}

export const INIT_STORAGE_ACTIONS: Record<StorageKey, (value: unknown) => void> = {
  [STORAGE_KEYS.STYLES_CONFIG]: value => {
    toggleStylesActions(value, 'init')
  },
  [STORAGE_KEYS.GLOBAL_CONFIG]: globalConfigActions
} as const

export const UPDATE_STORAGE_ACTIONS: Record<StorageKey, (value: unknown) => void> = {
  [STORAGE_KEYS.STYLES_CONFIG]: value => {
    toggleStylesActions(value, 'update')
  },
  [STORAGE_KEYS.GLOBAL_CONFIG]: updateGlobalConfigActions
}
