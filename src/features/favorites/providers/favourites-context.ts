import type { CheckedState } from '@radix-ui/react-checkbox'
import { createContext, type Dispatch, type SetStateAction } from 'react'

import type { FavoritesElements } from '@/services/media-vida'

interface Props extends FavoritesElements {
  allChecked: {
    setState: Dispatch<SetStateAction<CheckedState>>
    state: CheckedState
  }
}

export const FavouritesContext = createContext<Props | null>(null)
