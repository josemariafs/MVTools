import { useCallback, useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { useGlobalConfigStore } from '@/features/hooks/use-global-config-store'
import { toggleStyle } from '@/utils/dom'
import { cn } from '@/utils/tailwind'

const parentStyles = {
  backgroundColor: '#272d30',
  color: '#8f989e',
  paddingTop: '8px',
  paddingBottom: '8px'
}

const elementStyles = {
  display: 'none'
}

interface Props {
  parentElement: HTMLElement
  toggleElements: HTMLElement[]
  author: string
  type: 'post' | 'reply' | 'pm'
  onClick?: (author: string) => void
}

export const IgnoreUser = ({ parentElement, toggleElements, author, type, onClick }: Props) => {
  const [showPost, setShowPost] = useState(false)
  const [ignoredUsers, showIgnoredUsers] = useGlobalConfigStore(state => [state.ignoredUsers, state.showIgnoredUsers])
  const isIgnoredUser = useMemo(() => ignoredUsers.map(user => user.toLowerCase()).includes(author.toLowerCase()), [author, ignoredUsers])
  const text = type === 'pm' ? 'Mensaje ignorado' : '🚩1 comentario ignorado'

  useEffect(() => {
    setShowPost(false)
    toggleStyle(parentElement, isIgnoredUser, parentStyles)
    toggleStyle(toggleElements, isIgnoredUser, elementStyles)

    return () => {
      toggleStyle(parentElement, false, parentStyles)
      toggleStyle(toggleElements, false, elementStyles)
    }
  }, [isIgnoredUser, showIgnoredUsers])

  const handleShowPost = useCallback(() => {
    onClick?.(author)
    setShowPost(true)
    toggleStyle(parentElement, false, parentStyles)
    toggleStyle(toggleElements, false, elementStyles)
  }, [toggleElements, parentElement])

  if (!isIgnoredUser || showPost) return null

  return (
    <div
      className={cn('flex h-[21px] items-center', {
        'ml-[74px]': type === 'post',
        'ml-16 p-2.5 pr-3.5 h-14': type === 'pm'
      })}
    >
      <span>{text}</span>
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
