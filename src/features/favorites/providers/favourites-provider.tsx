import type { CheckedState } from '@radix-ui/react-checkbox'
import { type PropsWithChildren, useMemo, useState } from 'react'

import { FavouritesContext } from '@/features/favorites/providers/favourites-context'
import type { FavoritesElements } from '@/services/media-vida'

export const FavouritesProvider = ({ children, ...rest }: PropsWithChildren<FavoritesElements>) => {
  const [allChecked, setAllChecked] = useState<CheckedState>(false)

  const data = useMemo(
    () => ({
      allChecked: {
        setState: setAllChecked,
        state: allChecked
      },
      ...rest
    }),
    [rest]
  )

  return <FavouritesContext value={data}>{children}</FavouritesContext>
}
