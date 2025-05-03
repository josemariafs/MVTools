export const BROWSER_STORAGE_KEYS = {
  STYLES_CONFIG: 'stylesConfig',
  GLOBAL_CONFIG: 'globalConfig',
  PERFORMED_UPGRADE_TASKS: 'performedUpgradeTasks',
  EXTENSION_MIGRATED_FROM_VERSION: 'extensionMigratedFromVersion',
  USER_PREFERENCES: 'userPreferences'
} as const

export type BrowserStorageKey = (typeof BROWSER_STORAGE_KEYS)[keyof typeof BROWSER_STORAGE_KEYS]
