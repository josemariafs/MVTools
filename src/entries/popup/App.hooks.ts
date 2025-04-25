import { globalConfigQueryOptions } from '@/entries/popup/hooks/use-global-config'
import { stylesConfigQueryOptions } from '@/entries/popup/hooks/use-styles-config'
import { useStorageListener } from '@/entries/popup/hooks/useStorageListener'
import { globalConfigSchema, stylesConfigSchema } from '@/services/config'
import { upgradeTasksSchema } from '@/services/upgrades'
import { BROWSER_STORAGE_KEYS } from '@/types/storage'

export const useStorageListeners = () => {
  useStorageListener({
    storageKey: BROWSER_STORAGE_KEYS.PERFORMED_UPGRADE_TASKS,
    schema: upgradeTasksSchema,
    logPrefix: 'Performed upgrade tasks',
    onChangeCb: (queryClient, newTasks, oldTasks) => {
      // Checking if the migrateFromLocalStorage task has changed, which means that all storage data has been migrated,
      // so we invalidate all queries to set the new data
      const hasChanged = newTasks?.migrateFromLocalStorage !== oldTasks?.migrateFromLocalStorage
      hasChanged && queryClient.invalidateQueries()
    }
  })

  useStorageListener({
    storageKey: BROWSER_STORAGE_KEYS.GLOBAL_CONFIG,
    schema: globalConfigSchema,
    logPrefix: 'Global config',
    onChangeCb: (queryClient, newConfig) => {
      // Checking if the config is null means that the user has manually removed the config from the storage
      // TODO: Not working on forms because tanstack-form doesn't reset the form state after receiving the new data
      const hasChanged = newConfig == null
      hasChanged && queryClient.invalidateQueries({ queryKey: globalConfigQueryOptions.queryKey })
    }
  })

  useStorageListener({
    storageKey: BROWSER_STORAGE_KEYS.STYLES_CONFIG,
    schema: stylesConfigSchema,
    logPrefix: 'Styles config',
    onChangeCb: (queryClient, newConfig) => {
      // Checking if the config is null means that the user has manually removed the config from the storage
      // TODO: Not working on forms because tanstack-form doesn't reset the form state after receiving the new data
      const hasChanged = newConfig == null
      hasChanged && queryClient.invalidateQueries({ queryKey: stylesConfigQueryOptions.queryKey })
    }
  })
}
