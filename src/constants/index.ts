// All Manifest V3 extensions need an add-on ID in their manifest when submitting to the Firefox Add-ons store.
// This ID is used to identify the extension in the store and in the browser.
// The ID must be unique and in the format of a UUID.
// More info: https://extensionworkshop.com/documentation/develop/extensions-and-the-add-on-id/

export const FIREFOX_ADDON_ID = 'random@id.fake' // Replace with the UUID of the extension

export const AI_MIN_POST_LENGTH = 350

export const URLS = {
  MEDIAVIDA: 'https://www.mediavida.com',
  CHOLLOMETRO: 'https://www.chollometro.com',
  CHOLLOMETRO_BACKEND: 'https://chollometro.digidip.net',
  GEMINI_CREATE_API_KEY: 'https://aistudio.google.com/app/apikey?hl=es-419'
} as const

export const ALLOWED_URLS = {
  MEDIAVIDA: `${URLS.MEDIAVIDA}/*`,
  CHOLLOMETRO: `${URLS.CHOLLOMETRO}/*`,
  CHOLLOMETRO_BACKEND: `${URLS.CHOLLOMETRO_BACKEND}/*`
} as const

export const ALL_ALLOWED_URLS = Object.values(ALLOWED_URLS)

export const HTML_ATTRIBUTES = {
  DATA_AUTOR: 'data-autor'
} as const

export const CSS_SELECTORS = {
  GLOBAL: {
    TOKEN: '#token'
  },
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
  },
  CHOLLOMETRO: {
    MAIN_CONTAINER: 'main[id="main"]',
    THREAD_TITLE: 'h1.thread-title',
    THREAD_PRICE: 'span.thread-price',
    VOUCHER_INPUT: 'div.voucher input',
    DESCRIPTION: 'div[data-t="description"]',
    GET_DEAL_BUTTON: 'a[data-t="getDeal"]',
    DEAL_IMG: 'picture.height--all-full img'
  },
  NEW_THREAD: {
    TITLE: '#cabecera',
    CATEGORY: '#tag',
    DESCRIPTION: '#cuerpo',
    OTHER_CATEGORY_OPTION: 'option[value="204"]'
  },
  MARKERS: {
    POST_CONTAINER: '.wpx',
    POST: '[id^="post-"]',
    THREAD_ANCHOR: '.post-meta > h1 > a',
    POST_CONTENT: '.post-contents',
    MARKED_DATE: '.post-meta > span',
    POST_AUTHOR_URL: '.post-meta > a.autor',
    BOTTOM_PANEL_CONTAINER: '#bottompanel > div',
    NAV_BUTTONS_CONTAINER: '.cf.mpad',
    NEXT_PAGE_BUTTON: 'a[title="Siguiente"]',
    PREVIOUS_PAGE_BUTTON: 'a[title="Anterior"]',
    BETWEEN_PAGE_BUTTON: 'ul.pg > li'
  }
} as const
