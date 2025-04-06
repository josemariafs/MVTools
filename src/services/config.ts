import { z } from 'zod'

import { getStoredProperty, setStoredProperty } from '@/services/storage'

export const globalConfigSchema = z.object({
  geminiApiKey: z.string(),
  ignoredUsers: z.array(z.string()),
  showIgnoredUsers: z.boolean(),
  userNotes: z.array(z.object({ username: z.string(), note: z.string() })),
  highlightedUsers: z.array(z.string())
})

export type GlobalConfig = z.infer<typeof globalConfigSchema>
export type UserNote = GlobalConfig['userNotes'][number]

export const BROWSER_STORAGE_KEYS = {
  STYLES_CONFIG: 'stylesConfig',
  GLOBAL_CONFIG: 'globalConfig'
} as const

export type BrowserStorageKey = (typeof BROWSER_STORAGE_KEYS)[keyof typeof BROWSER_STORAGE_KEYS]

export const getGlobalConfig = () =>
  getStoredProperty<GlobalConfig>(BROWSER_STORAGE_KEYS.GLOBAL_CONFIG, {
    geminiApiKey: '',
    ignoredUsers: [],
    showIgnoredUsers: false,
    userNotes: [],
    highlightedUsers: []
  })
export const setGlobalConfig = (value: GlobalConfig) => setStoredProperty(BROWSER_STORAGE_KEYS.GLOBAL_CONFIG, value)

export const stylesConfigSchema = z.object({
  premiumEnabled: z.boolean(),
  premiumBgDisabled: z.boolean(),
  ultraWideEnabled: z.boolean()
})

export type StylesConfig = z.infer<typeof stylesConfigSchema>

export const getStylesConfig = () =>
  getStoredProperty<StylesConfig>(BROWSER_STORAGE_KEYS.STYLES_CONFIG, {
    premiumEnabled: false,
    premiumBgDisabled: false,
    ultraWideEnabled: false
  })

export const setStylesConfig = (value: StylesConfig) => setStoredProperty(BROWSER_STORAGE_KEYS.STYLES_CONFIG, value)
