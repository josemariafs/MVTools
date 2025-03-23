import { createContext } from 'react'

import type { PrivateMessagesElements } from '@/services/media-vida'

export const PrivateMessageContext = createContext<PrivateMessagesElements | null>(null)
