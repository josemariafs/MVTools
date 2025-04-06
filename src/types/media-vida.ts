export interface PostElements {
  id: string
  author: string
  comment: string
  postContainer: HTMLElement
  commentContainer: HTMLElement
  postAvatarContainer: HTMLElement
  postBodyContainer: HTMLElement
  postButtonsContainer: HTMLElement
}

export interface PostReplyElements {
  id: string
  author: string
  replyContainer: HTMLElement
  replyAvatarContainer: HTMLElement
  replyMetaContainer: HTMLElement
  replyBodyContainer: HTMLElement
  replyPostControlsContainer: HTMLElement | null
}

export interface PrivateMessagesElements {
  userMessagesElements: Array<{
    author: string
    userContainer: HTMLElement
    userContent: HTMLElement
  }>
  author: string
  title: HTMLElement
  contentContainer: HTMLElement
}

export interface ReportElements {
  reportElements: Array<{
    buttonContainer: HTMLElement
    commentContainer: HTMLElement
    comment: string
    id: number
  }>
  title: HTMLElement
}

export interface CloneElements {
  mainContainer: HTMLElement
  contentContainer: HTMLElement
  clonesHeader?: string
  cantTouchThis: boolean
  currentQueriesText: string
  clonesList: Array<{
    href: string
    nick: string
    text: string
    badge: CloneBadge | undefined
  }>
}

export type CloneBadgeType = 'b' | 'p' | 'd' | (string & {})

export interface CloneBadge {
  text: string
  twBg: string
}

export interface FavoritesElements {
  token: string
  buttonsContainer: HTMLElement
  tableHeaderRow: HTMLTableRowElement
  tableFooterRowCell: HTMLTableColElement
  tableRows: Array<{
    id: string
    row: HTMLTableRowElement
  }>
}

export const FROM_SECTIONS = {
  FAVORITES: 'foro/favoritos',
  IGNORED: 'foro/ignorados'
} as const

export type FromSection = (typeof FROM_SECTIONS)[keyof typeof FROM_SECTIONS]

export interface SectionActionsParams {
  threadId: string
  token: string
  toggle: boolean
  fromSection: FromSection
}

export const THREAD_LIST_TYPES = {
  FAVORITES: 'favoritos',
  IGNORED: 'ignorados'
} as const

export type ThreadListType = (typeof THREAD_LIST_TYPES)[keyof typeof THREAD_LIST_TYPES]

export const CSS_CLASS_NAMES = {
  MV_PREMIUM: 'mvpremium',
  MV_PREMIUM_WITHOUT_BG: 'MvPremiumCSSWithoutBG',
  MV_ULTRA_WIDE: 'mvultrawide'
} as const

export type CssClassName = (typeof CSS_CLASS_NAMES)[keyof typeof CSS_CLASS_NAMES]
