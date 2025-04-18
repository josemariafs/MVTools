import { queryOptions, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

import { getPerformedUpgradeTasks, type UpgradeTasks, upgradeTasksSchema } from '@/services/upgrades'
import { BROWSER_STORAGE_KEYS } from '@/types/storage'
import { setupStorageListener } from '@/utils/storage'

export const isMigratedFromLocalStorageQueryOptions = queryOptions({
  queryKey: ['migratedFromLocalStorage'],
  queryFn: async () => {
    const { migrateFromLocalStorage } = await getPerformedUpgradeTasks()
    return migrateFromLocalStorage
  },
  staleTime: Infinity
})

export const useIsMigratedFromLocalStorage = () => {
  const queryClient = useQueryClient()

  useEffect(() => {
    const unsubscribe = setupStorageListener<UpgradeTasks>({
      storageKey: BROWSER_STORAGE_KEYS.PERFORMED_UPGRADE_TASKS,
      schema: upgradeTasksSchema,
      logPrefix: 'Performed upgrade tasks',
      onChangeCb: () => queryClient.invalidateQueries()
    })

    return () => {
      unsubscribe()
    }
  }, [queryClient])

  return useSuspenseQuery(isMigratedFromLocalStorageQueryOptions)
}
