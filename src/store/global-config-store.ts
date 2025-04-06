import { Store } from '@tanstack/react-store'

import { getGlobalConfig, type GlobalConfig } from '@/services/config'

export const globalConfigStore = new Store<GlobalConfig>(await getGlobalConfig())

export const updateGlobalConfigStore = (globalConfig: GlobalConfig) => {
  globalConfigStore.setState(state => ({ ...state, ...globalConfig }))
}
