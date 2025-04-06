import '@/entries/enableDevHmr'
import '@/entries/contentScript/global.css'

import { updateAndListenGlobalConfigStore } from '@/entries/contentScript/utils/config'
import { renderApp } from '@/entries/contentScript/utils/render'
import { PrivateMessages } from '@/features/private-messages'
import { devLog } from '@/utils/logging'

await updateAndListenGlobalConfigStore()
devLog.log('Rendering private messages')
renderApp(<PrivateMessages />, import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS)
