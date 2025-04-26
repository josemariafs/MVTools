import browser from 'webextension-polyfill'

import { type GlobalConfig, setGlobalConfig, setStylesConfig, type StylesConfig } from '@/services/config'
import { MESSAGE_TYPES, type MigratedFromLocalStoragePayload } from '@/types/event-messages'

type ScriptWindow = Window &
  typeof globalThis & {
    globalConfig: GlobalConfig
    stylesConfig: StylesConfig
  }

const { globalConfig, stylesConfig } = window as ScriptWindow

interface NotedUser {
  nickname: string
  note: string
}

interface OldLocalStorageValues {
  ignoredUsers: string[]
  showIgnoredUsers: boolean
  notedUsers: NotedUser[]
  highlightedUsers: string[]
  mvPremium: boolean
  mvPremiumNoBg: boolean
  mvUltraWide: boolean
  geminiApiKey: string
}

const OLD_LOCAL_STORAGE_KEYS = {
  IGNORED_USERS: 'ignoredUser',
  SHOW_IGNORED_USERS: 'showIgnoredUsers',
  NOTED_USER: 'notedUser',
  HIGHLIGHTED_USER: 'highlightedUser',
  MV_PREMIUM_CSS: 'MvPremiumCSS',
  MV_PREMIUM_CSS_WITHOUT_BG: 'MvPremiumCSSWithoutBG',
  MV_ULTRA_WIDE: 'mvultrawide',
  GEMINI_API_KEY: 'apiKey'
} as const

type OldLocalStorageKey = (typeof OLD_LOCAL_STORAGE_KEYS)[keyof typeof OLD_LOCAL_STORAGE_KEYS]

const oldLocalStorageValues: OldLocalStorageValues = {
  ignoredUsers: getOldLocalStorageValue<string[]>(OLD_LOCAL_STORAGE_KEYS.IGNORED_USERS, []),
  showIgnoredUsers: getOldLocalStorageValue<boolean>(OLD_LOCAL_STORAGE_KEYS.SHOW_IGNORED_USERS, false),
  notedUsers: getOldLocalStorageValue<NotedUser[]>(OLD_LOCAL_STORAGE_KEYS.NOTED_USER, []),
  highlightedUsers: getOldLocalStorageValue<string[]>(OLD_LOCAL_STORAGE_KEYS.HIGHLIGHTED_USER, []),
  mvPremium: getOldLocalStorageValue<boolean>(OLD_LOCAL_STORAGE_KEYS.MV_PREMIUM_CSS, false),
  mvPremiumNoBg: getOldLocalStorageValue<boolean>(OLD_LOCAL_STORAGE_KEYS.MV_PREMIUM_CSS_WITHOUT_BG, false),
  mvUltraWide: getOldLocalStorageValue<boolean>(OLD_LOCAL_STORAGE_KEYS.MV_ULTRA_WIDE, false),
  geminiApiKey: getOldLocalStorageValue<string>(OLD_LOCAL_STORAGE_KEYS.GEMINI_API_KEY, '')
}

const newGlobalConfig = structuredClone(globalConfig)
const mappedOldNotes = oldLocalStorageValues.notedUsers
  .filter(user => user.nickname && user.note)
  .map(user => ({ username: user.nickname, note: user.note }))
newGlobalConfig.userNotes = mergeAndDeduplicate(globalConfig.userNotes, mappedOldNotes, 'username')
newGlobalConfig.ignoredUsers = mergeAndDeduplicate(globalConfig.ignoredUsers, oldLocalStorageValues.ignoredUsers)
newGlobalConfig.highlightedUsers = mergeAndDeduplicate(globalConfig.highlightedUsers, oldLocalStorageValues.highlightedUsers)
newGlobalConfig.showIgnoredUsers ||= oldLocalStorageValues.showIgnoredUsers
newGlobalConfig.geminiApiKey ||= oldLocalStorageValues.geminiApiKey

const newStylesConfig = structuredClone(stylesConfig)
newStylesConfig.premiumEnabled ||= oldLocalStorageValues.mvPremium
newStylesConfig.premiumBgDisabled ||= oldLocalStorageValues.mvPremiumNoBg
newStylesConfig.ultraWideEnabled ||= oldLocalStorageValues.mvUltraWide

try {
  console.debug('Migrating from local storage')
  await Promise.all([
    setGlobalConfig(newGlobalConfig),
    setStylesConfig(newStylesConfig),
    browser.runtime.sendMessage<MigratedFromLocalStoragePayload>({ type: MESSAGE_TYPES.MIGRATED_FROM_LOCAL_STORAGE, migrated: true })
  ])
  console.debug('Migration from local storage completed')
  removeOldLocalStorageValues()
  console.debug('Old local storage values removed')
} catch (error) {
  console.error('Error migrating from local storage:', error)
  await Promise.all([
    setGlobalConfig(globalConfig),
    setStylesConfig(stylesConfig),
    browser.runtime.sendMessage<MigratedFromLocalStoragePayload>({ type: MESSAGE_TYPES.MIGRATED_FROM_LOCAL_STORAGE, migrated: false })
  ])
} finally {
  close()
}

function getOldLocalStorageValue<T>(key: OldLocalStorageKey, defaultValue: T): T {
  const value = localStorage.getItem(key)
  if (value === null) return defaultValue
  try {
    const parsedValue = JSON.parse(value)
    if (Array.isArray(parsedValue)) {
      return parsedValue.filter(Boolean) as T
    }
    return parsedValue as T
  } catch (e) {
    return value as T
  }
}

function removeOldLocalStorageValues() {
  Object.values(OLD_LOCAL_STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key)
  })
}

function deduplicateWithObjects<T>(items: T[], uniqueKey: keyof T): T[] {
  const map = new Map<string | T[keyof T], T>()
  const getLookupKey = (item: T): string | T[keyof T] | undefined => {
    if (item != null && typeof item === 'object' && uniqueKey in item) {
      const value = item[uniqueKey]
      return typeof value === 'string' ? value.toLowerCase() : value
    }
    return undefined
  }

  items.forEach(item => {
    const lookupKey = getLookupKey(item)
    if (lookupKey !== undefined) {
      let objectToStore = item
      const originalValue = item[uniqueKey]
      if (typeof originalValue === 'string') {
        objectToStore = {
          ...item,
          [uniqueKey]: originalValue.toLowerCase()
        }
      }
      map.set(lookupKey, objectToStore)
    }
  })

  return Array.from(map.values()).filter(item => item != null && typeof item === 'object' && uniqueKey in item && Boolean(item[uniqueKey]))
}

function deduplicatePrimitivesOrByReference<T>(items: T[]): T[] {
  const resultMap = new Map<string | T, T>()

  items.forEach(item => {
    const key = typeof item === 'string' ? item.toLowerCase() : item
    if (!resultMap.has(key)) {
      resultMap.set(key, item)
    }
  })

  return Array.from(resultMap.values())
}

function mergeAndDeduplicate<T>(existingArray: T[], newArray: T[], uniqueKey?: keyof T): T[] {
  const combinedArray = [...existingArray, ...newArray]
  const nonNullItems = combinedArray.filter(Boolean)

  if (uniqueKey != null) {
    return deduplicateWithObjects(nonNullItems, uniqueKey)
  } else {
    return deduplicatePrimitivesOrByReference(nonNullItems)
  }
}
