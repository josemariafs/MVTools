import { createDOMElementIfNotPresent } from '@/utils/dom'

export interface PostElements {
  id: string
  author: string
  comment: string
  postContainer: HTMLElement
  postAvatarContainer: HTMLElement
  postBodyContainer: HTMLElement
  userNotesContainer?: HTMLElement
  aiButtonContainer?: HTMLElement
  aiContentContainer?: HTMLElement
}

export const getPostsElements = (): PostElements[] => {
  return Array.from<HTMLElement>(document.querySelectorAll('[data-autor]'))
    .map(post => {
      const commentContainer = post.querySelector<HTMLElement>('.post-contents')!
      const aiContentContainer = createDOMElementIfNotPresent({
        id: `${post.id}-summary-content`,
        container: commentContainer
      })
      const aiButtonContainer = createDOMElementIfNotPresent({
        id: `${post.id}-summary-button`,
        container: post.querySelector<HTMLElement>('.buttons'),
        tagName: 'li',
        where: 'afterbegin'
      })
      const postAvatarContainer = post.querySelector<HTMLElement>('.post-avatar')!
      const userNotesContainer = createDOMElementIfNotPresent({
        id: `${post.id}-user-notes`,
        container: postAvatarContainer
      })

      return {
        id: post.id,
        author: post.getAttribute('data-autor')!,
        comment: commentContainer.innerText,
        postContainer: post,
        postAvatarContainer,
        postBodyContainer: post.querySelector<HTMLElement>('.post-body')!,
        userNotesContainer,
        aiButtonContainer,
        aiContentContainer
      }
    })
    .filter(Boolean)
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
