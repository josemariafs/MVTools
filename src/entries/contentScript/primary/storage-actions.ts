import { CSS_CLASS_NAMES, STORAGE_KEYS, type StorageKey } from '@/constants'
import { isBoolean } from '@/utils/asserts'
import { toggleClass } from '@/utils/dom'
import { devLog } from '@/utils/logging'

const {
  MV_PREMIUM_ENABLED,
  MV_PREMIUM_BG_DISABLED,
  MV_ULTRA_WIDE_ENABLED,
  SHOW_IGNORED_USERS,
  IGNORED_USERS,
  USER_NOTES,
  HIGHLIGHTED_USERS,
  GEMINI_APY_KEY
} = STORAGE_KEYS

const { MV_PREMIUM, MV_PREMIUM_WITHOUT_BG, MV_ULTRA_WIDE } = CSS_CLASS_NAMES

export const STORAGE_KEY_ACTIONS: Record<StorageKey, (newValue: unknown) => void> = {
  [MV_PREMIUM_ENABLED]: (newValue: unknown) => {
    if (!isBoolean(newValue)) return

    devLog({ message: `MV Premium styles toggled: ${newValue ? 'ENABLED' : 'DISABLED'}` })
    toggleClass(MV_PREMIUM, newValue)
  },
  [MV_PREMIUM_BG_DISABLED]: (newValue: unknown) => {
    if (!isBoolean(newValue)) return

    devLog({ message: `Disable Premium Background toggled: ${newValue ? 'ENABLED' : 'DISABLED'}` })
    toggleClass(MV_PREMIUM_WITHOUT_BG, newValue)
  },
  [MV_ULTRA_WIDE_ENABLED]: (newValue: unknown) => {
    if (!isBoolean(newValue)) return

    devLog({ message: `Premium Ultrawide mode toggled: ${newValue ? 'ENABLED' : 'DISABLED'}` })
    toggleClass(MV_ULTRA_WIDE, newValue)
  },
  [SHOW_IGNORED_USERS]: (newValue: unknown) => {
    if (!isBoolean(newValue)) return

    devLog({ message: `Ignored users visibility toggled: ${newValue ? 'ENABLED' : 'DISABLED'}` })
    // Placeholder for future implementation
  },
  [IGNORED_USERS]: (newValue: unknown) => {
    if (!Array.isArray(newValue)) return

    devLog({ message: `Ignored users updated: ${newValue.toString()}` })
    // Placeholder for future implementation
  },
  [USER_NOTES]: (newValue: unknown) => {
    if (!Array.isArray(newValue)) return

    devLog({ message: `User notes updated: ${newValue.toString()}` })
    // Placeholder for future implementation
  },
  [HIGHLIGHTED_USERS]: (newValue: unknown) => {
    if (!Array.isArray(newValue)) return

    devLog({ message: `Highlighted users updated: ${newValue.toString()}` })
    // Placeholder for future implementation
  },
  [GEMINI_APY_KEY]: (newValue: unknown) => {
    if (typeof newValue !== 'string') return

    devLog({ message: `Gemini API key updated: ${newValue}` })
    // Placeholder for future implementation
  }
} as const
