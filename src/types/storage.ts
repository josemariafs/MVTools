export const BROWSER_STORAGE_KEYS = {
  STYLES_CONFIG: 'stylesConfig',
  GLOBAL_CONFIG: 'globalConfig',
  PERFORMED_UPGRADE_TASKS: 'performedUpgradeTasks',
  EXTENSION_MIGRATED_FROM_VERSION: 'extensionMigratedFromVersion',
  USER_PREFERENCES: 'userPreferences',
  /** Caché local (no sync) del calendario RAWG — Epic 1 */
  RAWG_UPCOMING_CACHE: 'rawgUpcomingCache',
  /** Borrador “nuevo hilo juegos” tras click en calendario — Epic 2 */
  PENDING_JUEGOS_THREAD: 'pendingJuegosThread',
  /** Ep. 3: por cada día YYYY-MM-DD, ids RAWG ya notificados */
  RELEASE_DAY_NOTIFIED_BY_YMD: 'releaseDayNotifiedByYmd'
} as const

export type BrowserStorageKey = (typeof BROWSER_STORAGE_KEYS)[keyof typeof BROWSER_STORAGE_KEYS]
