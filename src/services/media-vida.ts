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
