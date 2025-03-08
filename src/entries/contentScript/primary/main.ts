import browser from 'webextension-polyfill'

import type { StorageKey } from '@/constants'
import { STORAGE_KEY_ACTIONS } from '@/entries/contentScript/primary/storage-actions'
import { getConfigService } from '@/services/config-service'
import { isStorageKey } from '@/utils/asserts'

browser.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== 'sync') return

  Object.entries(changes)
    .filter(([key]) => isStorageKey(key))
    .forEach(([key, { newValue }]) => {
      STORAGE_KEY_ACTIONS[key as StorageKey](newValue)
    })
})

const ConfigService = getConfigService()
const configValues = await ConfigService.getAll()

Object.entries(configValues).forEach(([key, value]) => {
  STORAGE_KEY_ACTIONS[key as StorageKey](value)
})
