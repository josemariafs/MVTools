import { FavouritesContext } from '@/features/favorites/providers/favourites-context'
import { createUseContext } from '@/utils/contexts'

export const useFavorites = createUseContext(FavouritesContext)
