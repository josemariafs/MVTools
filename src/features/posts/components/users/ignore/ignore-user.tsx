import { useCallback, useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { usePostsConfigStore } from '@/features/posts/hooks/use-posts-config-store'
import { toggleStyle } from '@/utils/dom'
import { cn } from '@/utils/tailwind'

interface Props {
  parentElement: HTMLElement
  toggleElements: HTMLElement[]
  author: string
  type: 'post' | 'reply'
}

export const IgnoreUser = ({ parentElement, toggleElements, author, type }: Props) => {
  const [showPost, setShowPost] = useState(false)
  const ignoredUsers = usePostsConfigStore(state => state.ignoredUsers)
  const showIgnoredUsers = usePostsConfigStore(state => state.showIgnoredUsers)
  const isIgnoredUser = useMemo(() => ignoredUsers.map(user => user.toLowerCase()).includes(author.toLowerCase()), [author, ignoredUsers])

  useEffect(() => {
    setShowPost(false)
    toggleStyle(toggleElements, isIgnoredUser, { display: 'none' })
    toggleStyle(parentElement, isIgnoredUser, {
      backgroundColor: '#272d30',
      borderColor: '#21262b',
      color: '#8f989e',
      paddingTop: '8px',
      paddingBottom: '8px'
    })

    return () => {
      toggleStyle([...toggleElements, parentElement], false)
    }
  }, [isIgnoredUser, showIgnoredUsers])

  const handleShowPost = useCallback(() => {
    setShowPost(true)
    toggleStyle([...toggleElements, parentElement], false)
  }, [])

  if (!isIgnoredUser || showPost) return null
  return (
    <div className={cn('flex h-[21px] items-center', type === 'post' && 'ml-[74px]')}>
      <span>🚩1 comentario ignorado</span>
      {showIgnoredUsers && (
        <Button
          className='m-0 ml-3.5 h-[21.5px] rounded-[3px] border border-solid border-[#aba39b] bg-transparent px-[5px] py-[3px] text-[13px] text-[#8f989e] hover:bg-[#5e666e] hover:text-[#b9c8ce]'
          onClick={handleShowPost}
        >
          Mostrar
        </Button>
      )}
    </div>
  )
}
