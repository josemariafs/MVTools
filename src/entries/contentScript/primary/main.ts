import browser from 'webextension-polyfill'

import type { StorageKey } from '@/constants'
import { STORAGE_ACTIONS } from '@/entries/contentScript/primary/actions'
import { getAllStorageConfigs } from '@/services/config'
import { isStorageKey, objectEntries } from '@/utils/asserts'

browser.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== 'sync') return

  objectEntries(changes)
    .filter(([key]) => isStorageKey(key))
    .forEach(([key, { newValue }]) => {
      STORAGE_ACTIONS[key as StorageKey](newValue)
    })
})

const storageConfigs = await getAllStorageConfigs()
objectEntries(storageConfigs).forEach(([storageKey, value]) => {
  STORAGE_ACTIONS[storageKey](value)
})
