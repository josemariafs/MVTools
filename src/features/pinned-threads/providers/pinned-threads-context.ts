import type { CheckedState } from '@radix-ui/react-checkbox'
import { createContext, type Dispatch, type SetStateAction } from 'react'

import type { ThreadListType } from '@/constants'
import type { FavoritesElements } from '@/services/media-vida'

export interface PinnedThreadsData extends FavoritesElements {
  allChecked: {
    setState: Dispatch<SetStateAction<CheckedState>>
    state: CheckedState
  }
  type: ThreadListType
}

export const PinnedThreadsContext = createContext<PinnedThreadsData | null>(null)
