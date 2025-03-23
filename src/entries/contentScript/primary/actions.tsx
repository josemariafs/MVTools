import { CSS_CLASS_NAMES, type Module, MODULES, PATH_REGEXP, STORAGE_KEYS, type StorageKey } from '@/constants'
import { renderApp } from '@/entries/contentScript/primary'
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

  const pathToModuleMap: Record<string, Module> = {
    [PATH_REGEXP.THREAD.source]: MODULES.THREAD,
    [PATH_REGEXP.PRIVATE_MESSAGES.source]: MODULES.PRIVATE_MESSAGES,
    [PATH_REGEXP.REPORTS.source]: MODULES.REPORTS,
    [PATH_REGEXP.CLONES.source]: MODULES.CLONES
  }

  for (const [path, module] of objectEntries(pathToModuleMap)) {
    if (isUrlPath(RegExp(path))) {
      devLog.log(`Rendering ${module} with:`, validGlobalConfig.data)
      renderApp(module)
      return
    }
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
