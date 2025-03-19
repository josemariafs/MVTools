import { type Dispatch, type SetStateAction, useEffect, useMemo } from 'react'

import { usePrivateMessageContext } from '@/features/private-messages/providers/private-message-context-provider'
import { useGlobalConfigStore } from '@/features/thread/hooks/use-global-config-store'
import { toggleStyle } from '@/utils/dom'

const elementStyles = {
  display: 'none'
}

interface Props {
  showContent: boolean
  setShowContent: Dispatch<SetStateAction<boolean>>
}

export const Content = ({ showContent, setShowContent }: Props) => {
  const { author, title, contentContainer } = usePrivateMessageContext()
  const [ignoredUsers, showIgnoredUsers] = useGlobalConfigStore(state => [state.ignoredUsers, state.showIgnoredUsers])
  const isIgnoredUser = useMemo(
    () => ignoredUsers.map(user => user.toLowerCase()).includes(author.toLowerCase()) && !showContent,
    [author, ignoredUsers, showContent]
  )

  useEffect(() => {
    toggleStyle(title, isIgnoredUser, elementStyles)
    toggleStyle(contentContainer, isIgnoredUser, elementStyles)
    !showIgnoredUsers && setShowContent(false)

    return () => {
      toggleStyle(title, false, elementStyles)
      toggleStyle(contentContainer, false, elementStyles)
    }
  }, [isIgnoredUser, showIgnoredUsers])

  if (!isIgnoredUser || showContent) return null

  return <span className='tex flex size-full items-center justify-center pt-96 text-3xl'>Mensaje ignorado 🚩</span>
}
