import { CSS_SELECTORS, HTML_ATTRIBUTES, URLS } from '@/constants'
import {
  type FavoritesElements,
  FROM_SECTIONS,
  type FromSection,
  type MarkerPost,
  type MarkersElements,
  type PostElements,
  type PostReplyElements,
  type PrivateMessagesElements,
  type ReportElements,
  type SectionActionsParams,
  THREAD_LIST_TYPES,
  type ThreadListType
} from '@/types/media-vida'

const { GLOBAL, POSTS, REPLIES, PRIVATE_MESSAGES, REPORTS, FAVOURITES, MARKERS } = CSS_SELECTORS
const { DATA_AUTOR } = HTML_ATTRIBUTES

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

// eslint-disable-next-line complexity -- Not that complex
export const getMarkersPostElements = (post: HTMLElement): MarkerPost => {
  const threadAnchor = post.querySelector<HTMLAnchorElement>(MARKERS.THREAD_ANCHOR)
  return {
    thread: {
      id: post.dataset.tid!,
      title: threadAnchor?.textContent ?? ''
    },
    post: {
      id: post.dataset.num!,
      content: post.querySelector(MARKERS.POST_CONTENT)?.textContent ?? '',
      url: threadAnchor?.href ?? '',
      markedDate: post.querySelector<HTMLSpanElement>(MARKERS.MARKED_DATE)?.title ?? '',
      author: {
        name: post.dataset.autor!,
        url: post.querySelector<HTMLAnchorElement>(MARKERS.POST_AUTHOR_URL)?.href ?? ''
      }
    }
  }
}

export const getMarkersElements = (): MarkersElements => {
  const postsContainer = document.querySelector<HTMLElement>(MARKERS.POST_CONTAINER)
  const posts = Array.from(postsContainer?.querySelectorAll<HTMLElement>(MARKERS.POST) ?? [])
  const bottomPanelContainer = document.querySelector<HTMLElement>(MARKERS.BOTTOM_PANEL_CONTAINER)

  return {
    navButtonsContainer: document.querySelector<HTMLElement>(MARKERS.NAV_BUTTONS_CONTAINER),
    postsContainer,
    token: document.querySelector<HTMLInputElement>(GLOBAL.TOKEN)!.value,
    posts: posts.map(getMarkersPostElements),
    bottomPanel: {
      hasPanel: !!bottomPanelContainer,
      nextButtonHref: bottomPanelContainer?.querySelector<HTMLAnchorElement>(MARKERS.NEXT_PAGE_BUTTON)?.href,
      prevButtonHref: bottomPanelContainer?.querySelector<HTMLAnchorElement>(MARKERS.PREVIOUS_PAGE_BUTTON)?.href,
      betweenButtons: Array.from(bottomPanelContainer?.querySelectorAll<HTMLLIElement>(MARKERS.BETWEEN_PAGE_BUTTON) ?? []).map(
        liElement => {
          const aElement = liElement.querySelector<HTMLAnchorElement>('a')
          const spanElement = liElement.querySelector<HTMLSpanElement>('span')

          return {
            href: aElement?.href,
            text: aElement?.textContent ?? spanElement?.textContent ?? '',
            isCurrent: !!spanElement?.classList.contains('current')
          }
        }
      )
    }
  }
}

export const checkUser = async (nick: string) => {
  const response = await fetch(`${URLS.MEDIAVIDA}/usuarios/action/joincheck.php`, {
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

  const response = await fetch(`${URLS.MEDIAVIDA}/foro/action/topic_fav.php`, {
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

  const response = await fetch(`${URLS.MEDIAVIDA}/foro/action/topic_ignore.php`, {
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

const toggleBookmarkedPost = async ({
  isBookmarked,
  threadId,
  postId,
  token
}: {
  threadId: string
  postId: string
  isBookmarked: boolean
  token: string
}) => {
  const undo = isBookmarked ? 'false' : 'true'

  const response = await fetch(`${URLS.MEDIAVIDA}/foro/action/bookmark.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: `tid=${threadId}&num=${postId}&undo=${undo}&token=${token}`
  })

  if (!response.ok) {
    throw new Error('Ocurrió un error al marcar/desmarcar el post como marcado')
  }

  const data = (await response.json()) as number
  if (!data) throw new Error('Ocurrió un error al marcar/desmarcar el post como marcado')
}

const getNewToken = async (fromSection?: FromSection) => {
  const url = fromSection ? `${URLS.MEDIAVIDA}/${fromSection}` : location.href
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Ocurrió un error al obtener el nuevo token.')
  }

  const text = await response.text()
  const parser = new DOMParser()
  const doc = parser.parseFromString(text, 'text/html')
  const token = doc.querySelector<HTMLInputElement>(GLOBAL.TOKEN)?.value
  if (!token) throw new Error('No se encontró el nuevo token.')
  return token
}

const getPinnedThreadsAction = async (params: SectionActionsParams) => {
  const SECTION_ACTIONS: Record<FromSection, () => Promise<void>> = {
    [FROM_SECTIONS.FAVORITES]: () => toggleFavoriteThread({ isFavorite: params.toggle, ...params }),
    [FROM_SECTIONS.IGNORED]: () => toggleIgnoreThread({ isIgnored: params.toggle, ...params })
  } as const
  await SECTION_ACTIONS[params.fromSection]()
}

const getSectionFromType = (type: ThreadListType) => {
  const FROM_SECTION_TYPES: Record<ThreadListType, FromSection> = {
    [THREAD_LIST_TYPES.FAVORITES]: FROM_SECTIONS.FAVORITES,
    [THREAD_LIST_TYPES.IGNORED]: FROM_SECTIONS.IGNORED
  } as const

  return FROM_SECTION_TYPES[type]
}

const checkRejectedValues = async <T>({
  items,
  settledResults,
  fromSection,
  retries,
  maxRetries = 3
}: {
  items: T[]
  settledResults: Array<PromiseSettledResult<T>>
  fromSection?: FromSection
  retries: number
  maxRetries?: number
}) => {
  const rejectedIndices = new Set<number>()
  settledResults.filter(({ status }) => status === 'rejected').forEach((_result, index) => rejectedIndices.add(index))
  const rejectedValues = items.filter((_, index) => rejectedIndices.has(index))

  if (rejectedValues.length && retries < maxRetries) {
    const newToken = await getNewToken(fromSection)
    return { rejectedValues, newToken }
  }

  if (retries === maxRetries) throw new Error('Se han intentado demasiadas veces.')
}

export const modifyPinnedThreads = async ({
  items,
  token,
  type,
  action,
  retries = 0
}: {
  items: string[]
  token: string
  type: ThreadListType
  action: 'add' | 'remove'
  retries?: number
}): Promise<void> => {
  const fromSection = getSectionFromType(type)

  const results = await Promise.allSettled(
    items.map(async threadId => {
      const toggle = action === 'add'
      await getPinnedThreadsAction({ threadId, token, toggle, fromSection })
      return threadId
    })
  )

  const result = await checkRejectedValues({ items, settledResults: results, fromSection, retries })
  if (!result?.rejectedValues.length) return

  await modifyPinnedThreads({ items: result.rejectedValues, token: result.newToken, type, action, retries: retries + 1 })
}

export const modifyBookmarkedPosts = async ({
  items,
  token,
  action,
  retries = 0
}: {
  items: Array<{ threadId: string; postId: string }>
  token: string
  action: 'add' | 'remove'
  retries?: number
}) => {
  const results = await Promise.allSettled(
    items.map(async ({ threadId, postId }) => {
      const toggle = action === 'add'
      await toggleBookmarkedPost({ threadId, postId, token, isBookmarked: toggle })
      return { threadId, postId }
    })
  )

  const result = await checkRejectedValues({ items, settledResults: results, retries })
  if (!result?.rejectedValues.length) return

  await modifyBookmarkedPosts({ items: result.rejectedValues, token: result.newToken, action, retries: retries + 1 })
}
