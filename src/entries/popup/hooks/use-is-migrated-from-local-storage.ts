import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

import { getPerformedUpgradeTasks } from '@/services/upgrades'

export const isMigratedFromLocalStorageQueryOptions = queryOptions({
  queryKey: ['migratedFromLocalStorage'],
  queryFn: async () => {
    const { migrateFromLocalStorage } = await getPerformedUpgradeTasks()
    return migrateFromLocalStorage
  },
  staleTime: Infinity
})

export const useIsMigratedFromLocalStorage = () => useSuspenseQuery(isMigratedFromLocalStorageQueryOptions)
