import '@/entries/enableDevHmr'
import '@/entries/contentScript/global.css'

import { updateAndListenGlobalConfigStore } from '@/entries/contentScript/utils/config'
import { renderApp } from '@/entries/contentScript/utils/render'
import { Thread } from '@/features/thread'
import { devLog } from '@/utils/logging'

await updateAndListenGlobalConfigStore()
devLog.log('Rendering thread')
renderApp(<Thread />, import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS)
