import semver from 'semver'
import { z } from 'zod'

import { getStoredProperty, setStoredProperty } from '@/services/storage'
import { BROWSER_STORAGE_KEYS } from '@/types/storage'
import { getEnumValues } from '@/utils/zod'

import pkg from '../../package.json'

export const UPGRADE_TASK_IDS = {
  MIGRATED_FROM_LOCAL_STORAGE: 'migrateFromLocalStorage',
  UPDATE_GLOBAL_CONFIG: 'updateGlobalConfig'
} as const

type UpgradeTaskId = (typeof UPGRADE_TASK_IDS)[keyof typeof UPGRADE_TASK_IDS]

const UPGRADE_TASK_TYPES = {
  MANUAL: 'manual',
  AUTO: 'auto'
} as const

const TASK_VERSION_THRESHOLDS = {
  [UPGRADE_TASK_IDS.MIGRATED_FROM_LOCAL_STORAGE]: '3.0.0',
  [UPGRADE_TASK_IDS.UPDATE_GLOBAL_CONFIG]: '3.1.0'
} as const satisfies Record<UpgradeTaskId, string>

export const upgradeTaskSchema = z.object({
  id: z.enum(getEnumValues(UPGRADE_TASK_IDS)),
  type: z.enum(getEnumValues(UPGRADE_TASK_TYPES)),
  migrated: z.boolean()
})

export const upgradeTasksSchema = z.array(upgradeTaskSchema)

type UpgradeTasks = z.infer<typeof upgradeTasksSchema>

const getDefaultMigrationState = (taskId: UpgradeTaskId, fromVersion: string): boolean => {
  const thresholdVersion = TASK_VERSION_THRESHOLDS[taskId]
  return semver.gte(fromVersion, thresholdVersion)
}

const buildDefaultUpgradeTasks = (fromVersion: string): UpgradeTasks => {
  return [
    {
      id: UPGRADE_TASK_IDS.MIGRATED_FROM_LOCAL_STORAGE,
      type: UPGRADE_TASK_TYPES.MANUAL,
      migrated: getDefaultMigrationState(UPGRADE_TASK_IDS.MIGRATED_FROM_LOCAL_STORAGE, fromVersion)
    },
    {
      id: UPGRADE_TASK_IDS.UPDATE_GLOBAL_CONFIG,
      type: UPGRADE_TASK_TYPES.AUTO,
      migrated: getDefaultMigrationState(UPGRADE_TASK_IDS.UPDATE_GLOBAL_CONFIG, fromVersion)
    }
  ]
}

export const getPerformedUpgradeTasks = async () => {
  const fromVersion = await getMigratedFromVersion()
  const defaultTasks = buildDefaultUpgradeTasks(fromVersion)
  return await getStoredProperty<UpgradeTasks>(BROWSER_STORAGE_KEYS.PERFORMED_UPGRADE_TASKS, defaultTasks)
}

export const setPerformedUpgradeTask = async (upgradeTaskId: UpgradeTaskId, finished: boolean) => {
  const tasks = await getPerformedUpgradeTasks()

  const newTasks = tasks.map(task => {
    if (task.id === upgradeTaskId) {
      return {
        ...task,
        migrated: finished
      }
    }
    return task
  })

  await setStoredProperty(BROWSER_STORAGE_KEYS.PERFORMED_UPGRADE_TASKS, newTasks)
}

const getMigratedFromVersion = () => getStoredProperty(BROWSER_STORAGE_KEYS.EXTENSION_MIGRATED_FROM_VERSION, pkg.version)
export const setMigratedFromVersion = (version: string) => setStoredProperty(BROWSER_STORAGE_KEYS.EXTENSION_MIGRATED_FROM_VERSION, version)
