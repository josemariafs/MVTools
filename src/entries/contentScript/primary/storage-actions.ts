import { STORAGE_KEYS, type StorageKey } from '@/constants'
import { isBoolean } from '@/utils/asserts'
import { devLog } from '@/utils/logging'

export const STORAGE_KEY_ACTIONS: Record<StorageKey, (newValue: unknown) => void> = {
  [STORAGE_KEYS.MV_PREMIUM_ENABLED]: (newValue: unknown) => {
    if (!isBoolean(newValue)) return

    devLog({ message: `MV Premium styles toggled: ${newValue ? 'ENABLED' : 'DISABLED'}` })
    newValue ? document.body.classList.add('mvpremium') : document.body.classList.remove('mvpremium')
  },
  [STORAGE_KEYS.MV_PREMIUM_BG_DISABLED]: (newValue: unknown) => {
    if (!isBoolean(newValue)) return

    devLog({ message: `Disable Premium Background toggled: ${newValue ? 'ENABLED' : 'DISABLED'}` })
    newValue ? document.body.classList.add('MvPremiumCSSWithoutBG') : document.body.classList.remove('MvPremiumCSSWithoutBG')
  },
  [STORAGE_KEYS.MV_ULTRA_WIDE_ENABLED]: (newValue: unknown) => {
    if (!isBoolean(newValue)) return

    devLog({ message: `Premium Ultrawide mode toggled: ${newValue ? 'ENABLED' : 'DISABLED'}` })
    newValue ? document.body.classList.add('mvultrawide') : document.body.classList.remove('mvultrawide')
  },
  [STORAGE_KEYS.SHOW_IGNORED_USERS]: (newValue: unknown) => {
    if (!isBoolean(newValue)) return

    devLog({ message: `Ignored users visibility toggled: ${newValue ? 'ENABLED' : 'DISABLED'}` })
    // Placeholder for future implementation
  },
  [STORAGE_KEYS.IGNORED_USERS]: (newValue: unknown) => {
    if (!Array.isArray(newValue)) return

    devLog({ message: `Ignored users updated: ${newValue.toString()}` })
    // Placeholder for future implementation
  },
  [STORAGE_KEYS.USER_NOTES]: (newValue: unknown) => {
    if (!Array.isArray(newValue)) return

    devLog({ message: `User notes updated: ${newValue.toString()}` })
    // Placeholder for future implementation
  },
  [STORAGE_KEYS.HIGHLIGHTED_USERS]: (newValue: unknown) => {
    if (!Array.isArray(newValue)) return

    devLog({ message: `Highlighted users updated: ${newValue.toString()}` })
    // Placeholder for future implementation
  },
  [STORAGE_KEYS.GEMINI_APY_KEY]: (newValue: unknown) => {
    if (typeof newValue !== 'string') return

    devLog({ message: `Gemini API key updated: ${newValue}` })
    // Placeholder for future implementation
  }
} as const
