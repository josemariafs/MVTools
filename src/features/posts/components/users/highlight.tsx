import { useEffect, useMemo } from 'react'

import { usePostsConfigStore } from '@/features/posts/hooks/use-posts-config-store'
import { usePostContext } from '@/features/posts/providers/post-context-provider'
import { toggleStyle } from '@/utils/dom'

const styles = { 'border-left': '10px #de6e17 solid', 'padding-left': '10px' }

export const Highlight = () => {
  const { postContainer, author } = usePostContext()
  const highlightedUsers = usePostsConfigStore(state => state.highlightedUsers)
  const isHighlightedUser = useMemo(
    () => highlightedUsers.map(user => user.toLowerCase()).includes(author.toLowerCase()),
    [author, highlightedUsers]
  )

  useEffect(() => {
    toggleStyle(postContainer, isHighlightedUser, styles)

    return () => {
      toggleStyle(postContainer, false, styles)
    }
  }, [postContainer, isHighlightedUser])

  return null
}
