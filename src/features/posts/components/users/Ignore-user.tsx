import { useCallback, useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { usePostsConfigStore } from '@/features/posts/hooks/use-posts-config-store'
import { setDisplay } from '@/utils/dom'

interface Props {
  toggleElements: HTMLElement[]
  author: string
}

export const IgnoreUser = ({ toggleElements, author }: Props) => {
  const [showPost, setShowPost] = useState(false)
  const ignoredUsers = usePostsConfigStore(state => state.ignoredUsers)
  const showIgnoredUsers = usePostsConfigStore(state => state.showIgnoredUsers)
  const isIgnoredUser = useMemo(() => ignoredUsers.map(user => user.toLowerCase()).includes(author.toLowerCase()), [author, ignoredUsers])

  useEffect(() => {
    setShowPost(false)
    setDisplay(toggleElements, isIgnoredUser ? 'none' : 'block')
  }, [isIgnoredUser])

  const handleShowPost = useCallback(() => {
    setShowPost(true)
    setDisplay(toggleElements, 'block')
  }, [])

  if (!isIgnoredUser || showPost) return null
  return !showIgnoredUsers ? 'Mensaje ignorado' : <Button onClick={handleShowPost}>Mostrar mensaje ignorado</Button>
}
