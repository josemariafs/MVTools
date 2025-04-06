import '@/entries/enableDevHmr'
import '@/entries/contentScript/global.css'

import { renderApp } from '@/entries/contentScript/utils/render'
import { Clones } from '@/features/clones'
import { devLog } from '@/utils/logging'

devLog.log('Rendering clones list')
renderApp(<Clones />, import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS)
