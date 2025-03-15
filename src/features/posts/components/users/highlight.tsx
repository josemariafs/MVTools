import { useEffect, useMemo } from 'react'

import { usePostsConfigStore } from '@/features/posts/hooks/use-posts-config-store'
import { usePostContext } from '@/features/posts/providers/post-context-provider'
import { toggleStyle } from '@/utils/dom'

export const Highlight = () => {
  const { postContainer, author } = usePostContext()
  const highlightedUsers = usePostsConfigStore(state => state.highlightedUsers)
  const isHighlightedUser = useMemo(
    () => highlightedUsers.map(user => user.toLowerCase()).includes(author.toLowerCase()),
    [author, highlightedUsers]
  )

  useEffect(() => {
    toggleStyle(postContainer, isHighlightedUser, { borderLeft: '10px #de6e17 solid', paddingLeft: '10px' })

    return () => {
      toggleStyle(postContainer, false)
    }
  }, [postContainer, isHighlightedUser])

  return null
}
