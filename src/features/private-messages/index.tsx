import { useCallback, useMemo, useState } from 'react'

import { Portal } from '@/components/ui/portal'
import { IgnoreUser } from '@/features/components/ignore-user'
import { Content } from '@/features/private-messages/components/content'
import { PrivateMessageContextProvider } from '@/features/private-messages/providers/private-message-context-provider'
import { getPrivateMessagesElements } from '@/services/media-vida'

export const PrivateMessages = () => {
  const [showContent, setShowContent] = useState(false)
  const privateMessages = useMemo(getPrivateMessagesElements, [])

  const handleShowContent = useCallback((author: string) => {
    privateMessages.author === author && setShowContent(true)
  }, [])

  return (
    <PrivateMessageContextProvider {...privateMessages}>
      {privateMessages.userMessagesElements.map(privateMessage => (
        <Portal
          key={privateMessage.author}
          root={privateMessage.userContainer}
        >
          <IgnoreUser
            parentElement={privateMessage.userContainer}
            toggleElements={[privateMessage.userContent]}
            author={privateMessage.author}
            type='pm'
            onClick={handleShowContent}
          />
        </Portal>
      ))}
      <Portal
        root={privateMessages.contentContainer}
        where='afterend'
      >
        <Content
          setShowContent={setShowContent}
          showContent={showContent}
        />
      </Portal>
    </PrivateMessageContextProvider>
  )
}
