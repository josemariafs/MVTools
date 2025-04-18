import '@/entries/enableDevHmr'
import '@/entries/contentScript/content-script.css'

import { renderApp } from '@/entries/contentScript/utils/render'
import { Deals } from '@/features/chollometro/deals'
import { devLog } from '@/utils/logging'

devLog.log('Rendering chollometro deals')
renderApp(<Deals />, import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS)
