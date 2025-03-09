import { getStoredProperty, setStoredProperty } from '@/services/storage-service'

import { STORAGE_KEYS } from '../constants'

export const getConfigService = () => ({
  getIsPremiumEnabled: () => getStoredProperty(STORAGE_KEYS.MV_PREMIUM_ENABLED, false),
  setPremiumEnabled: (value: boolean) => setStoredProperty(STORAGE_KEYS.MV_PREMIUM_ENABLED, value),
  getIsPremiumBackgroundDisabled: () => getStoredProperty(STORAGE_KEYS.MV_PREMIUM_BG_DISABLED, false),
  setPremiumBackgroundDisabled: (value: boolean) => setStoredProperty(STORAGE_KEYS.MV_PREMIUM_BG_DISABLED, value),
  getIsUltraWideEnabled: () => getStoredProperty(STORAGE_KEYS.MV_ULTRA_WIDE_ENABLED, false),
  setUltraWideEnabled: (value: boolean) => setStoredProperty(STORAGE_KEYS.MV_ULTRA_WIDE_ENABLED, value),
  getAll: () =>
    Promise.all([
      getStoredProperty(STORAGE_KEYS.MV_PREMIUM_ENABLED, false),
      getStoredProperty(STORAGE_KEYS.MV_PREMIUM_BG_DISABLED, false),
      getStoredProperty(STORAGE_KEYS.MV_ULTRA_WIDE_ENABLED, false)
    ]).then(([premiumEnabled, premiumBgDisabled, ultraWideEnabled]) => {
      return {
        [STORAGE_KEYS.MV_PREMIUM_ENABLED]: premiumEnabled,
        [STORAGE_KEYS.MV_PREMIUM_BG_DISABLED]: premiumBgDisabled,
        [STORAGE_KEYS.MV_ULTRA_WIDE_ENABLED]: ultraWideEnabled
      }
    })
})
