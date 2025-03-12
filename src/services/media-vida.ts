import { type RefinementCtx, z } from 'zod'

import { getPostsConfig } from '@/services/config'

const MIN_POST_LENGTH = 350

export interface PostElements {
  buttonContainer: HTMLElement
  contentContainer: HTMLElement
  id: string
  comment: string
}

export const getPostsElements = (): PostElements[] => {
  return Array.from<HTMLElement>(document.querySelectorAll('[data-autor]'))
    .map(post => {
      const commentElement = post.querySelector<HTMLElement>('.post-contents')
      if (!commentElement || commentElement.innerText.length < MIN_POST_LENGTH) return null

      const contentContainer = document.createElement('div')
      commentElement.appendChild(contentContainer)

      const buttons = post.querySelector('.buttons')
      if (!buttons) return null

      const buttonContainer = document.createElement('li')
      buttons.insertBefore(buttonContainer, buttons.firstChild)

      return {
        buttonContainer,
        contentContainer,
        id: post.id,
        comment: commentElement.innerText
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
