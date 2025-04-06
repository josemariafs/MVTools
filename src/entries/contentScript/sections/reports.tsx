import '@/entries/enableDevHmr'
import '@/entries/contentScript/global.css'

import { updateAndListenGlobalConfigStore } from '@/entries/contentScript/utils/config'
import { renderApp } from '@/entries/contentScript/utils/render'
import { Reports } from '@/features/reports'
import { devLog } from '@/utils/logging'

await updateAndListenGlobalConfigStore()
devLog.log('Rendering reports')
renderApp(<Reports />, import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS)
