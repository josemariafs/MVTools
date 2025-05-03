import '@/entries/enableDevHmr'
import '@/entries/contentScript/content-script.css'

import { renderApp } from '@/entries/contentScript/utils/render'
import { Markers } from '@/features/markers'
import { devLog } from '@/utils/logging'

devLog.log('Rendering markers list')
renderApp(<Markers />, import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS)
