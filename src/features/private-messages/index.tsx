import { useCallback, useMemo, useState } from 'react'

import { Content } from '@/features/private-messages/components/content'
import { PrivateMessageProvider } from '@/features/private-messages/providers/private-message-provider'
import { Portal } from '@/features/shared/components/portal'
import { IgnoreUser } from '@/features/shared/components/ui/ignore-user'
import { getPrivateMessagesElements } from '@/services/media-vida'

export const PrivateMessages = () => {
  const [showContent, setShowContent] = useState(false)
  const privateMessages = useMemo(getPrivateMessagesElements, [])

  const handleShowContent = useCallback((author: string) => {
    privateMessages.author === author && setShowContent(true)
  }, [])

  return (
    <PrivateMessageProvider {...privateMessages}>
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
    </PrivateMessageProvider>
  )
}
