import { CSS_SELECTORS, HTML_ATTRIBUTES } from '@/constants'

const { POSTS, REPLIES, PRIVATE_MESSAGES } = CSS_SELECTORS
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
