import browser from 'webextension-polyfill'
import type { ZodSchema } from 'zod'

import type { BrowserStorageKey } from '@/types/storage'
import { devLog } from '@/utils/logging'

interface StorageSetupParams<T> {
  storageKey: BrowserStorageKey
  schema: ZodSchema<T>
  logPrefix: string
  onChangeCb: (config: T) => void
}

export const setupStorageListener = <T>({ storageKey, schema, logPrefix, onChangeCb }: StorageSetupParams<T>) => {
  const listener = (changes: Record<string, browser.Storage.StorageChange>, areaName: string) => {
    if (areaName !== 'sync' || !changes[storageKey]) return

    const { newValue } = changes[storageKey]
    const validationResult = schema.safeParse(newValue)
    if (!validationResult.success) {
      devLog.error(`Invalid ${logPrefix.toLowerCase()} data received from storage change:`, validationResult.error)
      return
    }

    const validData = validationResult.data
    devLog.log(`${logPrefix} updated via listener:`, validData)
    onChangeCb(validData)
  }

  browser.storage.onChanged.addListener(listener)
  return () => {
    browser.storage.onChanged.removeListener(listener)
  }
}
