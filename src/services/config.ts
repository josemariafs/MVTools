import { z } from 'zod'

import { getStoredProperty, setStoredProperty } from '@/services/storage'
import { BROWSER_STORAGE_KEYS } from '@/types/storage'

export const globalConfigSchema = z.object({
  geminiApiKey: z.string(),
  ignoredUsers: z.array(z.string()),
  showIgnoredUsers: z.boolean(),
  userNotes: z.array(z.object({ username: z.string(), note: z.string() })),
  highlightedUsers: z.array(z.string())
})

export type GlobalConfig = z.infer<typeof globalConfigSchema>
export type UserNote = GlobalConfig['userNotes'][number]

export const DEFAULT_GLOBAL_CONFIG: GlobalConfig = {
  geminiApiKey: '',
  ignoredUsers: [],
  showIgnoredUsers: false,
  userNotes: [],
  highlightedUsers: []
}

export const getGlobalConfig = () => getStoredProperty<GlobalConfig>(BROWSER_STORAGE_KEYS.GLOBAL_CONFIG, DEFAULT_GLOBAL_CONFIG)
export const setGlobalConfig = (value: GlobalConfig) => setStoredProperty(BROWSER_STORAGE_KEYS.GLOBAL_CONFIG, value)

export const stylesConfigSchema = z.object({
  premiumEnabled: z.boolean(),
  premiumBgDisabled: z.boolean(),
  ultraWideEnabled: z.boolean()
})

export type StylesConfig = z.infer<typeof stylesConfigSchema>

export const DEFAULT_STYLES_CONFIG: StylesConfig = {
  premiumEnabled: false,
  premiumBgDisabled: false,
  ultraWideEnabled: false
}

export const getStylesConfig = () => getStoredProperty<StylesConfig>(BROWSER_STORAGE_KEYS.STYLES_CONFIG, DEFAULT_STYLES_CONFIG)
export const setStylesConfig = (value: StylesConfig) => setStoredProperty(BROWSER_STORAGE_KEYS.STYLES_CONFIG, value)

export interface UserPreferences {
  markersListMode: boolean
}

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  markersListMode: false
}

export const getUserPreferences = () => getStoredProperty<UserPreferences>(BROWSER_STORAGE_KEYS.USER_PREFERENCES, DEFAULT_USER_PREFERENCES)
export const setUserPreferences = (value: UserPreferences) => setStoredProperty(BROWSER_STORAGE_KEYS.USER_PREFERENCES, value)
