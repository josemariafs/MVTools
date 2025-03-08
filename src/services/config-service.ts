import { getStoredProperty, setStoredProperty } from '@/services/storage-service'

import { STORAGE_KEYS } from '../constants'

export const getConfigService = () => ({
  getIsPremiumEnabled: () => getStoredProperty(STORAGE_KEYS.MV_PREMIUM_ENABLED, false),
  setPremiumEnabled: (value: boolean) => setStoredProperty(STORAGE_KEYS.MV_PREMIUM_ENABLED, value),
  getIsPremiumBackgroundDisabled: () => getStoredProperty(STORAGE_KEYS.MV_PREMIUM_BG_DISABLED, false),
  setPremiumBackgroundDisabled: (value: boolean) => setStoredProperty(STORAGE_KEYS.MV_PREMIUM_BG_DISABLED, value),
  getIsUltraWideEnabled: () => getStoredProperty(STORAGE_KEYS.MV_ULTRA_WIDE_ENABLED, false),
  setUltraWideEnabled: (value: boolean) => setStoredProperty(STORAGE_KEYS.MV_ULTRA_WIDE_ENABLED, value),
  getAll: async () => ({
    [STORAGE_KEYS.MV_PREMIUM_ENABLED]: await getStoredProperty(STORAGE_KEYS.MV_PREMIUM_ENABLED, false),
    [STORAGE_KEYS.MV_PREMIUM_BG_DISABLED]: await getStoredProperty(STORAGE_KEYS.MV_PREMIUM_BG_DISABLED, false),
    [STORAGE_KEYS.MV_ULTRA_WIDE_ENABLED]: await getStoredProperty(STORAGE_KEYS.MV_ULTRA_WIDE_ENABLED, false)
  })
})
