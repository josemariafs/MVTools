import '@/entries/enableDevHmr'
import '@/entries/contentScript/global.css'

import { listenGlobalConfigChanges } from '@/entries/contentScript/utils/config'
import { renderApp } from '@/entries/contentScript/utils/render'
import { PrivateMessages } from '@/features/private-messages'
import { globalConfigStore, updateGlobalConfigStore } from '@/store/global-config-store'
import { devLog } from '@/utils/logging'

devLog.log('Rendering private messages with ignoredUsers:', globalConfigStore.state.ignoredUsers)
renderApp(<PrivateMessages />, import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS)
listenGlobalConfigChanges(updateGlobalConfigStore)
