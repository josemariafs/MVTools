import { useCallback, useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { usePostsConfigStore } from '@/features/posts/hooks/use-posts-config-store'
import { usePostContext } from '@/features/posts/providers/post-context-provider'
import { setDisplay } from '@/utils/dom'

export const IgnoreUser = () => {
  const [showPost, setShowPost] = useState(false)
  const ignoredUsers = usePostsConfigStore(state => state.ignoredUsers)
  const showIgnoredUsers = usePostsConfigStore(state => state.showIgnoredUsers)
  const { author, postAvatarContainer, postBodyContainer } = usePostContext()
  const isIgnoredUser = useMemo(() => ignoredUsers.map(user => user.toLowerCase()).includes(author.toLowerCase()), [author, ignoredUsers])

  useEffect(() => {
    setShowPost(false)
    setDisplay([postAvatarContainer, postBodyContainer], isIgnoredUser ? 'none' : 'block')
  }, [isIgnoredUser])

  const handleShowPost = useCallback(() => {
    setShowPost(true)
    setDisplay([postAvatarContainer, postBodyContainer], 'block')
  }, [])

  if (!isIgnoredUser || showPost) return null
  return !showIgnoredUsers ? 'Mensaje ignorado' : <Button onClick={handleShowPost}>Mostrar mensaje ignorado</Button>
}
