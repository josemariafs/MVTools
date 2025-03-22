import '../../enableDevHmr'

import browser from 'webextension-polyfill'

import { PATH_REGEXP, type StorageKey } from '@/constants'
import { INIT_STORAGE_ACTIONS, UPDATE_STORAGE_ACTIONS } from '@/entries/contentScript/primary/actions'
import { getAllStorageConfigs } from '@/services/config'
import { isStorageKey, isUrlPath, objectEntries } from '@/utils/asserts'

if (!isUrlPath(PATH_REGEXP.BLACKLIST)) {
  loadContent()
}

async function loadContent() {
  browser.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'sync') return

    objectEntries(changes)
      .filter(([key]) => isStorageKey(key))
      .forEach(([key, { newValue }]) => {
        UPDATE_STORAGE_ACTIONS[key as StorageKey](newValue)
      })
  })

  const storageConfigs = await getAllStorageConfigs()
  objectEntries(storageConfigs).forEach(([storageKey, value]) => {
    INIT_STORAGE_ACTIONS[storageKey](value)
  })
}
