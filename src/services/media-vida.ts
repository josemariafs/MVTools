import { CSS_SELECTORS, HTML_ATTRIBUTES, THREAD_LIST_TYPES, type ThreadListType } from '@/constants'

const { POSTS, REPLIES, PRIVATE_MESSAGES, REPORTS, CLONES, FAVOURITES } = CSS_SELECTORS
const { DATA_AUTOR } = HTML_ATTRIBUTES

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

export const getPostsElements = (): PostElements[] => {
  return Array.from<HTMLElement>(document.querySelectorAll(POSTS.MAIN_CONTAINER))
    .map(post => {
      const commentContainer = post.querySelector<HTMLElement>(POSTS.COMMENT_CONTAINER)!
      return {
        id: post.id,
        author: post.getAttribute(DATA_AUTOR)!,
        comment: commentContainer.innerText,
        postContainer: post,
        commentContainer,
        postAvatarContainer: post.querySelector<HTMLElement>(POSTS.AVATAR_CONTAINER)!,
        postBodyContainer: post.querySelector<HTMLElement>(POSTS.BODY_CONTAINER)!,
        postButtonsContainer: post.querySelector<HTMLElement>(POSTS.BUTTONS_CONTAINER)!
      }
    })
    .filter(Boolean)
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

export const getPostRepliesElements = (postRepliesContainers: HTMLElement[]): PostReplyElements[] => {
  return postRepliesContainers.map(replyContainer => ({
    id: replyContainer.dataset.num!,
    author: replyContainer.querySelector(REPLIES.AUTHOR_CONTAINER)!.textContent!,
    replyContainer,
    replyAvatarContainer: replyContainer.querySelector<HTMLElement>(REPLIES.AVATAR_CONTAINER)!,
    replyMetaContainer: replyContainer.querySelector<HTMLElement>(REPLIES.META_CONTAINER)!,
    replyBodyContainer: replyContainer.querySelector<HTMLElement>(REPLIES.BODY_CONTAINER)!,
    replyPostControlsContainer: replyContainer.querySelector<HTMLElement>(REPLIES.POST_CONTROLS_CONTAINER)
  }))
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

export const getPrivateMessagesElements = (): PrivateMessagesElements => {
  const usersContainer = document.querySelector<HTMLElement>(PRIVATE_MESSAGES.USERS_CONTAINER)!
  const title = document.querySelector<HTMLElement>(PRIVATE_MESSAGES.TITLE)!
  return {
    userMessagesElements: Array.from(usersContainer.querySelectorAll<HTMLElement>(PRIVATE_MESSAGES.USER_CONTAINER)).map(user => ({
      author: user.querySelector<HTMLElement>(PRIVATE_MESSAGES.USER_NAME)!.textContent!,
      userContainer: user,
      userContent: user.querySelector<HTMLElement>(PRIVATE_MESSAGES.USER_CONTENT)!
    })),
    author: title.innerText,
    title,
    contentContainer: document.querySelector<HTMLElement>(PRIVATE_MESSAGES.CONTENT_CONTAINER)!
  }
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

export const getReportsElements = (): ReportElements => {
  const reportsContainer = document.querySelector<HTMLElement>(REPORTS.REPORTS_CONTAINER)!
  return {
    reportElements: Array.from(reportsContainer.querySelectorAll<HTMLElement>(REPORTS.REPORT_CONTAINER)).map((report, index) => {
      const commentContainer = report.querySelector<HTMLElement>(REPORTS.REPORT_COMMENT_CONTAINER)!
      return {
        buttonContainer: report.querySelector<HTMLElement>(REPORTS.REPORT_BUTTONS_CONTAINER)!.lastElementChild! as HTMLElement,
        commentContainer,
        comment: commentContainer.innerText,
        id: index
      }
    }),
    title: document.querySelector<HTMLElement>(REPORTS.TITLE)!
  }
}

interface CloneElements {
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

type CloneBadgeType = 'b' | 'p' | 'd' | (string & {})

interface CloneBadge {
  text: string
  twBg: string
}

const getCloneBadge = (clone: HTMLElement): CloneBadge | undefined => {
  const type = clone.querySelector(CLONES.CLONE_BADGE)?.textContent as CloneBadgeType | undefined
  if (type == null) return

  const BADGE_TYPES: Record<CloneBadgeType, CloneBadge> = {
    b: {
      text: 'BANNED',
      twBg: 'bg-[#af2727]'
    },
    p: {
      text: 'Sanción activa',
      twBg: 'bg-[#34588f]'
    },
    d: {
      text: 'Cuenta desactivada',
      twBg: 'bg-[#2d2d2d]'
    },
    unknown: {
      text: 'Desconocido',
      twBg: 'bg-[#2d2d2d]'
    }
  } as const

  return BADGE_TYPES[type] ?? BADGE_TYPES.unknown
}

export const getClonesElements = (): CloneElements => {
  const mainContainer = document.querySelector<HTMLElement>(CLONES.MAIN_CONTAINER)!
  const contentContainer = mainContainer.querySelector<HTMLElement>(CLONES.CONTENT_CONTAINER)!
  const boxContainers = Array.from<HTMLElement>(mainContainer.querySelectorAll<HTMLElement>(CLONES.BOX_CONTAINER))
  const currentQueriesText = boxContainers[0]?.innerText ?? contentContainer.innerText

  return {
    mainContainer,
    contentContainer,
    currentQueriesText,
    cantTouchThis: currentQueriesText.includes("Can't touch this"),
    clonesHeader: boxContainers[1]?.querySelector(CLONES.HEADER)?.innerText,
    clonesList: Array.from<HTMLElement>(mainContainer.querySelectorAll(CLONES.LIST)).map(clone => {
      const anchor = clone.querySelector(CLONES.CLONE_ANCHOR)!
      const badge = getCloneBadge(clone)
      const nick = anchor.textContent!
      const textWithoutNick = clone.innerText.trim().replace(nick, '')
      return {
        href: anchor.href,
        nick,
        text: badge ? textWithoutNick.slice(0, -1) : textWithoutNick,
        badge: getCloneBadge(clone)
      }
    })
  }
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

export const getFavoritesElements = (): FavoritesElements => ({
  token: document.querySelector<HTMLInputElement>(FAVOURITES.TOKEN)!.value,
  buttonsContainer: document.querySelector<HTMLElement>(FAVOURITES.BUTTONS_CONTAINER)!,
  tableHeaderRow: document.querySelector<HTMLTableRowElement>(FAVOURITES.TABLE_HEADER_ROW)!,
  tableFooterRowCell: document.querySelector<HTMLTableColElement>(FAVOURITES.TABLE_FOOTER_ROW_CELL)!,
  tableRows: Array.from<HTMLTableRowElement>(document.querySelectorAll(FAVOURITES.TABLE_BODY_ROW)).map(row => {
    return {
      id: row.id.slice(1),
      row
    }
  })
})

export const checkUser = async (nick: string) => {
  const response = await fetch('https://www.mediavida.com/usuarios/action/joincheck.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: `do=username&q=${nick}`
  })

  if (!response.ok) {
    throw new Error('Ocurrió un error al verificar el usuario.')
  }

  const data = (await response.json()) as number

  if (!data) throw new Error('El usuario no existe.')
}

const toggleFavoriteThread = async ({ isFavorite, threadId, token }: { threadId: string; isFavorite: boolean; token: string }) => {
  const todo = isFavorite ? 'fav' : 'delfav'

  const response = await fetch('https://www.mediavida.com/foro/action/topic_fav.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: `todo=${todo}&tid=${threadId}&token=${token}`
  })

  if (!response.ok) {
    throw new Error('Ocurrió un error al marcar/desmarcar el hilo como favorito.')
  }

  const data = (await response.json()) as number
  if (!data) throw new Error('Ocurrió un error al marcar/desmarcar el hilo como favorito.')
}

const toggleIgnoreThread = async ({ isIgnored, threadId, token }: { threadId: string; isIgnored: boolean; token: string }) => {
  const action = isIgnored ? 'ignore' : 'unignore'

  const response = await fetch('https://www.mediavida.com/foro/action/topic_ignore.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: `action=${action}&tid=${threadId}&token=${token}`
  })

  if (!response.ok) {
    throw new Error('Ocurrió un error al marcar/desmarcar el hilo como ignorado.')
  }

  const data = (await response.json()) as number
  if (!data) throw new Error('Ocurrió un error al marcar/desmarcar el hilo como ignorado.')
}

const FROM_SECTIONS = {
  FAVORITES: 'foro/favoritos',
  IGNORED: 'foro/ignorados'
} as const

type FromSection = (typeof FROM_SECTIONS)[keyof typeof FROM_SECTIONS]

const getNewToken = async (fromSection: FromSection) => {
  const response = await fetch(`https://www.mediavida.com/${fromSection}`)

  if (!response.ok) {
    throw new Error('Ocurrió un error al obtener el nuevo token.')
  }

  const text = await response.text()
  const parser = new DOMParser()
  const doc = parser.parseFromString(text, 'text/html')
  const token = doc.querySelector<HTMLInputElement>(FAVOURITES.TOKEN)?.value
  if (!token) throw new Error('No se encontró el nuevo token.')
  return token
}

interface SectionActionsParams {
  threadId: string
  token: string
  toggle: boolean
  fromSection: FromSection
}

const getPinnedThreadsAction = async (params: SectionActionsParams) => {
  const SECTION_ACTIONS: Record<FromSection, () => Promise<void>> = {
    [FROM_SECTIONS.FAVORITES]: () => toggleFavoriteThread({ isFavorite: params.toggle, ...params }),
    [FROM_SECTIONS.IGNORED]: () => toggleIgnoreThread({ isIgnored: params.toggle, ...params })
  } as const
  await SECTION_ACTIONS[params.fromSection]()
}

export const removePinnedThreads = async ({
  items,
  token,
  fromSection,
  retries = 0
}: {
  items: string[]
  token: string
  fromSection: FromSection
  retries?: number
}): Promise<void> => {
  const results = await Promise.allSettled(
    items.map(async threadId => {
      await getPinnedThreadsAction({ threadId, token, toggle: false, fromSection })
      return threadId
    })
  )

  const fulfilledValues = results.filter(result => result.status === 'fulfilled').map(({ value }) => value)
  const rejectedValues = items.filter(item => !fulfilledValues.includes(item))

  if (rejectedValues.length && retries < 3) {
    const newToken = await getNewToken(fromSection)
    await removePinnedThreads({ items: rejectedValues, fromSection, token: newToken, retries: retries + 1 })
  }
}

export const getSectionFromType = (type: ThreadListType) => {
  const FROM_SECTION_TYPES: Record<ThreadListType, FromSection> = {
    [THREAD_LIST_TYPES.FAVORITES]: FROM_SECTIONS.FAVORITES,
    [THREAD_LIST_TYPES.IGNORED]: FROM_SECTIONS.IGNORED
  } as const

  return FROM_SECTION_TYPES[type]
}
