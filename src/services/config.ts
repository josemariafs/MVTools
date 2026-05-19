import browser from 'webextension-polyfill'
import { z } from 'zod'

import { DEFAULT_MODEL } from '@/services/gemini'
import { getStoredProperty, setStoredProperty } from '@/services/storage'
import { BROWSER_STORAGE_KEYS } from '@/types/storage'

export const globalConfigSchema = z.object({
  geminiApiKey: z.string(),
  geminiModel: z.string(),
  /** API key de [RAWG](https://rawg.io/apidocs) — calendario de lanzamientos (Épica 1) */
  rawgApiKey: z.string(),
  /** API key [ImgBB](https://api.imgbb.com/) — convierte imágenes Steam a PNG/GIF y las sube (hilos juegos). */
  imgbbApiKey: z.string(),
  ignoredUsers: z.array(z.string()),
  showIgnoredUsers: z.boolean(),
  userNotes: z.array(z.object({ username: z.string(), note: z.string() })),
  highlightedUsers: z.array(z.string())
})

export type GlobalConfig = z.infer<typeof globalConfigSchema>
export type UserNote = GlobalConfig['userNotes'][number]

export const DEFAULT_GLOBAL_CONFIG: GlobalConfig = {
  geminiApiKey: '',
  geminiModel: DEFAULT_MODEL,
  rawgApiKey: '',
  imgbbApiKey: '',
  ignoredUsers: [],
  showIgnoredUsers: false,
  userNotes: [],
  highlightedUsers: []
}

export const getGlobalConfig = async (): Promise<GlobalConfig> => {
  const { [BROWSER_STORAGE_KEYS.GLOBAL_CONFIG]: raw } = await browser.storage.sync.get(BROWSER_STORAGE_KEYS.GLOBAL_CONFIG)
  const merged = { ...DEFAULT_GLOBAL_CONFIG, ...((raw as Partial<GlobalConfig> | undefined) ?? {}) }
  const parsed = globalConfigSchema.safeParse(merged)
  if (!parsed.success) {
    // .parse() rompía el popup (pantalla negra) si el almacenamiento tenía claves
    // faltantes, null o tipos inesperados tras añadir campos (p. ej. rawgApiKey).
    console.warn('[MV Tools] Config global inválida, usando valores por defecto', parsed.error.flatten())
    return { ...DEFAULT_GLOBAL_CONFIG }
  }
  return parsed.data
}
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
