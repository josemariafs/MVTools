import { createContext } from 'react'

import type { PrivateMessagesElements } from '@/types/media-vida'

export const PrivateMessageContext = createContext<PrivateMessagesElements | null>(null)
