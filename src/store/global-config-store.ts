import { Store } from '@tanstack/react-store'

import { DEFAULT_GLOBAL_CONFIG } from '@/constants'
import type { GlobalConfig } from '@/services/config'

export const globalConfigStore = new Store<GlobalConfig>(DEFAULT_GLOBAL_CONFIG)

export const updateGlobalConfigStore = (globalConfig: GlobalConfig) => {
  globalConfigStore.setState(state => ({ ...state, ...globalConfig }))
}
