import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

import { getPerformedUpgradeTasks, UPGRADE_TASK_IDS } from '@/services/upgrades'

export const isMigratedFromLocalStorageQueryOptions = queryOptions({
  queryKey: ['migratedFromLocalStorage'],
  queryFn: async () => {
    const tasks = await getPerformedUpgradeTasks()
    return tasks.some(({ id, migrated }) => id === UPGRADE_TASK_IDS.MIGRATED_FROM_LOCAL_STORAGE && migrated)
  },
  staleTime: Infinity
})

export const useIsMigratedFromLocalStorage = () => useSuspenseQuery(isMigratedFromLocalStorageQueryOptions)
