// All Manifest V3 extensions need an add-on ID in their manifest when submitting to the Firefox Add-ons store.
// This ID is used to identify the extension in the store and in the browser.
// The ID must be unique and in the format of a UUID.
// More info: https://extensionworkshop.com/documentation/develop/extensions-and-the-add-on-id/

import type { PostsConfig } from '@/services/config'

export const FIREFOX_ADDON_ID = '{unknown}' // Replace with the UUID of the extension

export const AI_MIN_POST_LENGTH = 350

export const URLS = {
  GEMINI_CREATE_API_KEY: 'https://aistudio.google.com/app/apikey?hl=es-419'
} as const

export const STORAGE_KEYS = {
  STYLES_CONFIG: 'stylesConfig',
  POSTS_CONFIG: 'postsConfig'
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]

export const CSS_CLASS_NAMES = {
  MV_PREMIUM: 'mvpremium',
  MV_PREMIUM_WITHOUT_BG: 'MvPremiumCSSWithoutBG',
  MV_ULTRA_WIDE: 'mvultrawide'
} as const

export type CssClassName = (typeof CSS_CLASS_NAMES)[keyof typeof CSS_CLASS_NAMES]

export const DEFAULT_POSTS_CONFIG: PostsConfig = {
  geminiApiKey: '',
  ignoredUsers: [],
  showIgnoredUsers: false,
  userNotes: [],
  highlightedUsers: []
}
