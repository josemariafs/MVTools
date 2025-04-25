import { Store } from '@tanstack/react-store'

import { DEFAULT_GLOBAL_CONFIG, getGlobalConfig, type GlobalConfig } from '@/services/config'

export const globalConfigStore = new Store<GlobalConfig>(await getGlobalConfig())

export const updateGlobalConfigStore = (globalConfig?: GlobalConfig) => {
  globalConfigStore.setState(state => ({ ...state, ...(globalConfig ?? DEFAULT_GLOBAL_CONFIG) }))
}
