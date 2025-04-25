import browser from 'webextension-polyfill'
import type { ZodSchema } from 'zod'

import type { BrowserStorageKey } from '@/types/storage'
import { devLog } from '@/utils/logging'

export interface StorageSetupParams<T> {
  storageKey: BrowserStorageKey
  schema: ZodSchema<T>
  logPrefix: string
  onChangeCb: (newData?: T, oldData?: T) => void
}

export const setupStorageListener = <T>({ storageKey, schema, logPrefix, onChangeCb }: StorageSetupParams<T>) => {
  const listener = (changes: Record<string, browser.Storage.StorageChange>, areaName: string) => {
    if (areaName !== 'sync' || !changes[storageKey]) return

    const { newValue, oldValue } = changes[storageKey]
    const validationResult = schema.optional().safeParse(newValue)
    if (!validationResult.success) {
      devLog.error(`Invalid ${logPrefix.toLowerCase()} data received from storage change:`, validationResult.error)
      return
    }

    const validData = validationResult.data
    devLog.log(`${logPrefix} updated via listener:`, validData)
    onChangeCb(validData, oldValue as T | undefined)
  }

  browser.storage.onChanged.addListener(listener)
  return () => {
    browser.storage.onChanged.removeListener(listener)
  }
}
