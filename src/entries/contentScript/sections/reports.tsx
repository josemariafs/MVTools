import '@/entries/enableDevHmr'
import '@/entries/contentScript/global.css'

import { listenGlobalConfigChanges } from '@/entries/contentScript/utils/config'
import { renderApp } from '@/entries/contentScript/utils/render'
import { Reports } from '@/features/reports'
import { globalConfigStore, updateGlobalConfigStore } from '@/store/global-config-store'
import { devLog } from '@/utils/logging'

devLog.log('Rendering reports with API Key:', globalConfigStore.state.geminiApiKey)
renderApp(<Reports />, import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS)
listenGlobalConfigChanges(updateGlobalConfigStore)
