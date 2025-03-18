import { CSS_CLASS_NAMES, STORAGE_KEYS, type StorageKey } from '@/constants'
import { renderPosts } from '@/features/posts/main'
import { globalConfigSchema, stylesConfigSchema } from '@/services/config'
import { updateGlobalConfigStore } from '@/store/global-config-store'
import { objectEntries } from '@/utils/asserts'
import { toggleClass } from '@/utils/dom'
import { devLog } from '@/utils/logging'

const { MV_PREMIUM, MV_PREMIUM_WITHOUT_BG, MV_ULTRA_WIDE } = CSS_CLASS_NAMES

export const toggleStylesAction = (value: unknown) => {
  const validStylesConfig = stylesConfigSchema.safeParse(value)
  if (!validStylesConfig.success) return

  devLog.log('Styles config updated:', validStylesConfig.data)
  objectEntries(validStylesConfig.data).forEach(([key, value]) => {
    key === 'premiumEnabled' && toggleClass(MV_PREMIUM, value)
    key === 'premiumBgDisabled' && toggleClass(MV_PREMIUM_WITHOUT_BG, value)
    key === 'ultraWideEnabled' && toggleClass(MV_ULTRA_WIDE, value)
  })
}

export const updateGlobalConfigAction = (value: unknown) => {
  const validGlobalConfig = globalConfigSchema.safeParse(value)
  if (!validGlobalConfig.success) return

  devLog.log('Posts config updated:', validGlobalConfig.data)
  updateGlobalConfigStore(validGlobalConfig.data)
}

export const globalConfigAction = (value: unknown) => {
  const validGlobalConfig = globalConfigSchema.safeParse(value)
  if (!validGlobalConfig.success) return

  devLog.log('Rendering Posts with:', validGlobalConfig.data)
  updateGlobalConfigStore(validGlobalConfig.data)
  renderPosts()
}

export const INIT_STORAGE_ACTIONS: Record<StorageKey, (value: unknown) => void> = {
  [STORAGE_KEYS.STYLES_CONFIG]: toggleStylesAction,
  [STORAGE_KEYS.GLOBAL_CONFIG]: globalConfigAction
} as const

export const UPDATE_STORAGE_ACTIONS: Record<StorageKey, (value: unknown) => void> = {
  [STORAGE_KEYS.STYLES_CONFIG]: toggleStylesAction,
  [STORAGE_KEYS.GLOBAL_CONFIG]: updateGlobalConfigAction
}
