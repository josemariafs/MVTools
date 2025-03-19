import { createContext, type PropsWithChildren, useContext, useMemo } from 'react'

import type { PrivateMessagesElements } from '@/services/media-vida'

const PrivateMessageContext = createContext<PrivateMessagesElements | null>(null)

export const PrivateMessageContextProvider = ({ children, ...rest }: PropsWithChildren<PrivateMessagesElements>) => {
  const config = useMemo(() => ({ ...rest }), [rest])
  return <PrivateMessageContext.Provider value={config}>{children}</PrivateMessageContext.Provider>
}
export const usePrivateMessageContext = () => {
  const context = useContext(PrivateMessageContext)

  if (context == null) {
    throw new Error('usePrivateMessageContext must be used within a PrivateMessageContextProvider')
  }

  return { ...context }
}
