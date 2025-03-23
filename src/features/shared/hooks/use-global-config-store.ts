import { useStore } from '@tanstack/react-store'

import type { GlobalConfig } from '@/services/config'
import { globalConfigStore } from '@/store/global-config-store'

export const useGlobalConfigStore = <TSelected>(selector: (state: GlobalConfig) => TSelected): TSelected =>
  useStore(globalConfigStore, selector)
