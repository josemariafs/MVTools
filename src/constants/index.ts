// All Manifest V3 extensions need an add-on ID in their manifest when submitting to the Firefox Add-ons store.
// This ID is used to identify the extension in the store and in the browser.
// The ID must be unique and in the format of a UUID.
// More info: https://extensionworkshop.com/documentation/develop/extensions-and-the-add-on-id/

export const FIREFOX_ADDON_ID = '{unkown}' // Replace with the UUID of the extension

export const STORAGE_KEYS = {
  IGNORED_USERS: 'ignoredUser',
  USER_NOTES: 'notedUser',
  HIGHLIGHTED_USERS: 'highlightedUser',
  MV_PREMIUM_ENABLED: 'MvPremiumCSS',
  MV_PREMIUM_BG_DISABLED: 'MvPremiumCSSWithoutBG',
  MV_ULTRA_WIDE_ENABLED: 'mvultrawide',
  GEMINI_APY_KEY: 'apiKey',
  SHOW_IGNORED_USERS: 'ShowIgnoredUsers'
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]

export const CSS_CLASS_NAMES = {
  MV_PREMIUM: 'mvpremium',
  MV_PREMIUM_WITHOUT_BG: 'MvPremiumCSSWithoutBG',
  MV_ULTRA_WIDE: 'mvultrawide'
} as const
