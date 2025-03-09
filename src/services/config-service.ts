import { getStoredProperty, setStoredProperty } from '@/services/storage-service'

import { STORAGE_KEYS } from '../constants'

const getIsPremiumEnabled = () => getStoredProperty(STORAGE_KEYS.MV_PREMIUM_ENABLED, false)
const setPremiumEnabled = (value: boolean) => setStoredProperty(STORAGE_KEYS.MV_PREMIUM_ENABLED, value)
const getIsPremiumBackgroundDisabled = () => getStoredProperty(STORAGE_KEYS.MV_PREMIUM_BG_DISABLED, false)
const setPremiumBackgroundDisabled = (value: boolean) => setStoredProperty(STORAGE_KEYS.MV_PREMIUM_BG_DISABLED, value)
const getIsUltraWideEnabled = () => getStoredProperty(STORAGE_KEYS.MV_ULTRA_WIDE_ENABLED, false)
const setUltraWideEnabled = (value: boolean) => setStoredProperty(STORAGE_KEYS.MV_ULTRA_WIDE_ENABLED, value)

export const getConfigService = () => ({
  getIsPremiumEnabled,
  setPremiumEnabled,
  getIsPremiumBackgroundDisabled,
  setPremiumBackgroundDisabled,
  getIsUltraWideEnabled,
  setUltraWideEnabled,
  getAll: () =>
    Promise.all([getIsPremiumEnabled(), getIsPremiumBackgroundDisabled(), getIsUltraWideEnabled()]).then(
      ([premiumEnabled, premiumBgDisabled, ultraWideEnabled]) => {
        return {
          [STORAGE_KEYS.MV_PREMIUM_ENABLED]: premiumEnabled,
          [STORAGE_KEYS.MV_PREMIUM_BG_DISABLED]: premiumBgDisabled,
          [STORAGE_KEYS.MV_ULTRA_WIDE_ENABLED]: ultraWideEnabled
        }
      }
    )
})
