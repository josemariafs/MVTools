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
  return Array.from<HTMLElement>(document.querySelectorAll('[data-autor]'))
    .map(post => {
      const commentContainer = post.querySelector<HTMLElement>('.post-contents')!
      return {
        id: post.id,
        author: post.getAttribute('data-autor')!,
        comment: commentContainer.innerText,
        postContainer: post,
        commentContainer,
        postAvatarContainer: post.querySelector<HTMLElement>('.post-avatar')!,
        postBodyContainer: post.querySelector<HTMLElement>('.post-body')!,
        postButtonsContainer: post.querySelector<HTMLElement>('.buttons')!
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
    author: replyContainer.querySelector('.autor')!.textContent!,
    replyContainer,
    replyAvatarContainer: replyContainer.querySelector<HTMLElement>('.post-avatar-reply')!,
    replyMetaContainer: replyContainer.querySelector<HTMLElement>('.post-meta-reply')!,
    replyBodyContainer: replyContainer.querySelector<HTMLElement>('.post-contents')!,
    replyPostControlsContainer: replyContainer.querySelector<HTMLElement>('.post-controls-reply')
  }))
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
