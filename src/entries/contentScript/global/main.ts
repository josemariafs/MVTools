import '@/entries/enableDevHmr'

import { listenStylesConfigChanges } from '@/entries/contentScript/utils/config'
import { DEFAULT_STYLES_CONFIG, getStylesConfig, type StylesConfig } from '@/services/config'
import { CSS_CLASS_NAMES } from '@/types/media-vida'
import { objectEntries } from '@/utils/asserts'
import { toggleBodyClass } from '@/utils/dom'
import { devLog } from '@/utils/logging'
const { MV_PREMIUM, MV_PREMIUM_WITHOUT_BG, MV_ULTRA_WIDE } = CSS_CLASS_NAMES

const stylesConfig = await getStylesConfig()
devLog.log('Toggling styles with config:', stylesConfig)
toggleStyles(stylesConfig)
listenStylesConfigChanges(toggleStyles)

function toggleStyles(stylesConfig?: StylesConfig) {
  objectEntries(stylesConfig ?? DEFAULT_STYLES_CONFIG).forEach(([key, value]) => {
    key === 'premiumEnabled' && toggleBodyClass(MV_PREMIUM, value)
    key === 'premiumBgDisabled' && toggleBodyClass(MV_PREMIUM_WITHOUT_BG, value)
    key === 'ultraWideEnabled' && toggleBodyClass(MV_ULTRA_WIDE, value)
  })
}
