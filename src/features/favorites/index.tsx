import { useEffect, useMemo } from 'react'

import { TableBodyRows } from '@/features/favorites/components/table-body-rows'
import { TableHeaderCell } from '@/features/favorites/components/table-header-cell'
import { UnfavButton } from '@/features/favorites/components/unfav-button'
import { defaultValues, useAppForm } from '@/features/favorites/hooks/use-form'
import { usePreventDataScrollLocked } from '@/features/favorites/hooks/use-prevent-data-scroll-locked'
import { FavouritesProvider } from '@/features/favorites/providers/favourites-provider'
import { getFavoritesElements, removeFavoriteThreads } from '@/services/media-vida'

export const Favorites = () => {
  usePreventDataScrollLocked()
  const favoritesElements = useMemo(getFavoritesElements, [])
  const form = useAppForm({
    defaultValues,
    onSubmit: async ({ value: { items } }) => {
      await removeFavoriteThreads(items, favoritesElements.token)
      location.reload()
    }
  })

  useEffect(() => {
    favoritesElements.tableFooterRowCell.setAttribute('colspan', '7')
  }, [])

  return (
    <FavouritesProvider {...favoritesElements}>
      <UnfavButton form={form} />
      <TableHeaderCell form={form} />
      <TableBodyRows form={form} />
    </FavouritesProvider>
  )
}
