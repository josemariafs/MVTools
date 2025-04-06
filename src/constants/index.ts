// All Manifest V3 extensions need an add-on ID in their manifest when submitting to the Firefox Add-ons store.
// This ID is used to identify the extension in the store and in the browser.
// The ID must be unique and in the format of a UUID.
// More info: https://extensionworkshop.com/documentation/develop/extensions-and-the-add-on-id/

export const FIREFOX_ADDON_ID = '{unknown}' // Replace with the UUID of the extension

export const AI_MIN_POST_LENGTH = 350

export const URLS = {
  GEMINI_CREATE_API_KEY: 'https://aistudio.google.com/app/apikey?hl=es-419'
} as const

export const STORAGE_KEYS = {
  STYLES_CONFIG: 'stylesConfig',
  GLOBAL_CONFIG: 'globalConfig'
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]

export const CSS_CLASS_NAMES = {
  MV_PREMIUM: 'mvpremium',
  MV_PREMIUM_WITHOUT_BG: 'MvPremiumCSSWithoutBG',
  MV_ULTRA_WIDE: 'mvultrawide'
} as const

export type CssClassName = (typeof CSS_CLASS_NAMES)[keyof typeof CSS_CLASS_NAMES]

export const HTML_ATTRIBUTES = {
  DATA_AUTOR: 'data-autor'
} as const

export const CSS_SELECTORS = {
  POSTS: {
    MAIN_CONTAINER: `[${HTML_ATTRIBUTES.DATA_AUTOR}]`,
    COMMENT_CONTAINER: '.post-contents',
    AVATAR_CONTAINER: '.post-avatar',
    BODY_CONTAINER: '.post-body',
    BUTTONS_CONTAINER: '.buttons'
  },
  REPLIES: {
    MAIN_CONTAINER: '.rep',
    AUTHOR_CONTAINER: '.autor',
    AVATAR_CONTAINER: '.post-avatar-reply',
    META_CONTAINER: '.post-meta-reply',
    BODY_CONTAINER: '.post-contents',
    POST_CONTROLS_CONTAINER: '.post-controls-reply'
  },
  PRIVATE_MESSAGES: {
    USERS_CONTAINER: '#pms > div.threads7.pm-col.c-side-alt > div.wpx > div > ul',
    USER_CONTAINER: 'li',
    USER_CONTENT: 'a',
    USER_NAME: 'strong',
    TITLE: '#pms > div.msgs.pm-col.c-main-alt > div > h1',
    CONTENT_CONTAINER: '#pm-form'
  },
  REPORTS: {
    TITLE: '#title > div > h1',
    REPORTS_CONTAINER: '.mod-panel',
    REPORT_CONTAINER: '.entry',
    REPORT_BUTTONS_CONTAINER: '.side-options.c-side',
    REPORT_COMMENT_CONTAINER: '.msg'
  },
  CLONES: {
    MAIN_CONTAINER: '#main',
    CONTENT_CONTAINER: '.wrw',
    BOX_CONTAINER: '.box',
    HEADER: 'h3',
    LIST: 'ul > li',
    CLONE_ANCHOR: 'a',
    CLONE_BADGE: 'strong'
  },
  FAVOURITES: {
    TOKEN: '#token',
    BUTTONS_CONTAINER: '.cf.mpad.mg-b',
    TABLE_HEADER_ROW: '#tablatemas > thead > tr',
    TABLE_BODY_ROW: '#tablatemas > tbody > tr',
    TABLE_FOOTER_ROW_CELL: '#tablatemas > tfoot > tr > td'
  }
} as const

export const THREAD_LIST_TYPES = {
  FAVORITES: 'favoritos',
  IGNORED: 'ignorados'
} as const

export type ThreadListType = (typeof THREAD_LIST_TYPES)[keyof typeof THREAD_LIST_TYPES]
