export const BROWSER_STORAGE_KEYS = {
  STYLES_CONFIG: 'stylesConfig',
  GLOBAL_CONFIG: 'globalConfig'
} as const

export type BrowserStorageKey = (typeof BROWSER_STORAGE_KEYS)[keyof typeof BROWSER_STORAGE_KEYS]
