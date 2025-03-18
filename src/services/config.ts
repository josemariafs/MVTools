import { z } from 'zod'

import { getStoredProperty, setStoredProperty } from '@/services/storage'

import { DEFAULT_GLOBAL_CONFIG, STORAGE_KEYS } from '../constants'

export const globalConfigSchema = z.object({
  geminiApiKey: z.string(),
  ignoredUsers: z.array(z.string()),
  showIgnoredUsers: z.boolean(),
  userNotes: z.array(z.object({ username: z.string(), note: z.string() })),
  highlightedUsers: z.array(z.string())
})

export type GlobalConfig = z.infer<typeof globalConfigSchema>
export type UserNote = GlobalConfig['userNotes'][number]

export const getGlobalConfig = () => getStoredProperty<GlobalConfig>(STORAGE_KEYS.GLOBAL_CONFIG, DEFAULT_GLOBAL_CONFIG)
export const setGlobalConfig = (value: GlobalConfig) => setStoredProperty(STORAGE_KEYS.GLOBAL_CONFIG, value)

export const stylesConfigSchema = z.object({
  premiumEnabled: z.boolean(),
  premiumBgDisabled: z.boolean(),
  ultraWideEnabled: z.boolean()
})

type StylesConfig = z.infer<typeof stylesConfigSchema>

export const getStylesConfig = () =>
  getStoredProperty<StylesConfig>(STORAGE_KEYS.STYLES_CONFIG, {
    premiumEnabled: false,
    premiumBgDisabled: false,
    ultraWideEnabled: false
  })

export const setStylesConfig = (value: StylesConfig) => setStoredProperty(STORAGE_KEYS.STYLES_CONFIG, value)

export const getAllStorageConfigs = () =>
  Promise.all([getStylesConfig(), getGlobalConfig()]).then(([stylesConfig, globalConfig]) => ({
    [STORAGE_KEYS.STYLES_CONFIG]: stylesConfig,
    [STORAGE_KEYS.GLOBAL_CONFIG]: globalConfig
  }))
