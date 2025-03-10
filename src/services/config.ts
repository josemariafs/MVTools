import { getStoredProperty, setStoredProperty } from '@/services/storage'

import { STORAGE_KEYS } from '../constants'

export const getIsPremiumEnabled = () => getStoredProperty(STORAGE_KEYS.MV_PREMIUM_ENABLED, false)
export const setPremiumEnabled = (value: boolean) => setStoredProperty(STORAGE_KEYS.MV_PREMIUM_ENABLED, value)
export const getIsPremiumBackgroundDisabled = () => getStoredProperty(STORAGE_KEYS.MV_PREMIUM_BG_DISABLED, false)
export const setPremiumBackgroundDisabled = (value: boolean) => setStoredProperty(STORAGE_KEYS.MV_PREMIUM_BG_DISABLED, value)
export const getIsUltraWideEnabled = () => getStoredProperty(STORAGE_KEYS.MV_ULTRA_WIDE_ENABLED, false)
export const setUltraWideEnabled = (value: boolean) => setStoredProperty(STORAGE_KEYS.MV_ULTRA_WIDE_ENABLED, value)
export const getGeminiApiKey = () => getStoredProperty(STORAGE_KEYS.GEMINI_APY_KEY, '')
export const setGeminiApiKey = (value: string) => setStoredProperty(STORAGE_KEYS.GEMINI_APY_KEY, value)
export const getAll = () =>
  Promise.all([getIsPremiumEnabled(), getIsPremiumBackgroundDisabled(), getIsUltraWideEnabled(), getGeminiApiKey()]).then(
    ([premiumEnabled, premiumBgDisabled, ultraWideEnabled, geminiApiKey]) => {
      return {
        [STORAGE_KEYS.MV_PREMIUM_ENABLED]: premiumEnabled,
        [STORAGE_KEYS.MV_PREMIUM_BG_DISABLED]: premiumBgDisabled,
        [STORAGE_KEYS.MV_ULTRA_WIDE_ENABLED]: ultraWideEnabled,
        [STORAGE_KEYS.GEMINI_APY_KEY]: geminiApiKey
      }
    }
  )
