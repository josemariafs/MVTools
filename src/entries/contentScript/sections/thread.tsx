import '@/entries/enableDevHmr'
import '@/entries/contentScript/content-script.css'

import { listenGlobalConfigChanges } from '@/entries/contentScript/utils/config'
import { renderApp } from '@/entries/contentScript/utils/render'
import { Thread } from '@/features/thread'
import { globalConfigStore, updateGlobalConfigStore } from '@/store/global-config-store'
import { devLog } from '@/utils/logging'

devLog.log('Rendering thread with config:', globalConfigStore.state)
renderApp(<Thread />, import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS)
listenGlobalConfigChanges(updateGlobalConfigStore)
