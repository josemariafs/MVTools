import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

import { useMutate } from '@/entries/popup/hooks/use-mutate'
import { getPerformedUpgradeTasks, setPerformedUpgradeTask, UPGRADE_TASKS } from '@/services/upgrades'

export const isMigratedFromLocalStorageQueryOptions = queryOptions({
  queryKey: ['migratedFromLocalStorage'],
  queryFn: async () => {
    const { migrateFromLocalStorage } = await getPerformedUpgradeTasks()
    return migrateFromLocalStorage
  },
  staleTime: Infinity
})

export const useIsMigratedFromLocalStorage = () => useSuspenseQuery(isMigratedFromLocalStorageQueryOptions)
const mutateFunction = (migrated: boolean) => setPerformedUpgradeTask(UPGRADE_TASKS.MIGRATED_FROM_LOCAL_STORAGE, migrated)
export const useMutateIsMigratedFromLocalStorage = () => useMutate(isMigratedFromLocalStorageQueryOptions.queryKey, mutateFunction, false)
