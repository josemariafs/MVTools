import '@/entries/enableDevHmr'
import '@/entries/contentScript/global.css'

import { renderApp } from '@/entries/contentScript/utils/render'
import { PinnedThreads } from '@/features/pinned-threads'
import { THREAD_LIST_TYPES } from '@/types/media-vida'
import { devLog } from '@/utils/logging'

devLog.log('Rendering ignored list')
renderApp(<PinnedThreads type={THREAD_LIST_TYPES.IGNORED} />, import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS)
