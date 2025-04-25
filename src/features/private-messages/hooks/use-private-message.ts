import { PrivateMessageContext } from '@/features/private-messages/providers/private-message-context'
import { createUseContext } from '@/utils/contexts'

export const usePrivateMessage = createUseContext(PrivateMessageContext)
