import { type RefinementCtx, z } from 'zod'

import { getPostsConfig } from '@/services/config'

export interface PostElements {
  id: string
  author: string
  comment: string
  postContainer: HTMLElement
  postAvatarContainer: HTMLElement
  postBodyContainer: HTMLElement
  aiButtonContainer: HTMLElement
  aiContentContainer: HTMLElement
}

export const getPostsElements = (): PostElements[] => {
  return Array.from<HTMLElement>(document.querySelectorAll('[data-autor]'))
    .map(post => {
      const commentElement = post.querySelector<HTMLElement>('.post-contents')!
      const aiContentContainer = document.createElement('div')
      commentElement.appendChild(aiContentContainer)
      const buttons = post.querySelector<HTMLElement>('.buttons')!
      const aiButtonContainer = document.createElement('li')
      buttons.insertBefore(aiButtonContainer, buttons.firstChild)

      return {
        id: post.id,
        author: post.getAttribute('data-autor')!,
        comment: commentElement.innerText,
        postContainer: post,
        postAvatarContainer: post.querySelector<HTMLElement>('.post-avatar')!,
        postBodyContainer: post.querySelector<HTMLElement>('.post-body')!,
        aiButtonContainer,
        aiContentContainer
      }
    })
    .filter(Boolean)
}

const checkUser = async (nick: string) => {
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

export const userValidator = async (value: string, ctx: RefinementCtx) => {
  try {
    const postsConfig = await getPostsConfig()
    if (postsConfig.ignoredUsers.includes(value)) {
      throw new Error('El usuario ya está en la lista de ignorados.')
    }
    await checkUser(value)
  } catch (error) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: (error as Error).message
    })
  }
}
