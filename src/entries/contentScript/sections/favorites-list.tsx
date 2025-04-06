import '@/entries/enableDevHmr'
import '@/entries/contentScript/global.css'

import { THREAD_LIST_TYPES } from '@/constants'
import { renderApp } from '@/entries/contentScript/utils/render'
import { PinnedThreads } from '@/features/pinned-threads'
import { devLog } from '@/utils/logging'

devLog.log('Rendering favorites list')
renderApp(<PinnedThreads type={THREAD_LIST_TYPES.FAVORITES} />, import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS)
