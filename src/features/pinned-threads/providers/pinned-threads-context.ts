import type { CheckedState } from '@radix-ui/react-checkbox'
import { createContext, type Dispatch, type SetStateAction } from 'react'

import type { FavoritesElements, ThreadListType } from '@/types/media-vida'

export interface PinnedThreadsData extends FavoritesElements {
  allChecked: {
    setState: Dispatch<SetStateAction<CheckedState>>
    state: CheckedState
  }
  type: ThreadListType
}

export const PinnedThreadsContext = createContext<PinnedThreadsData | null>(null)
