import { PrivateMessageContext } from '@/features/private-messages/providers/private-message-context'
import { createContextProvider } from '@/utils/contexts'

export const PrivateMessageProvider = createContextProvider(PrivateMessageContext)
