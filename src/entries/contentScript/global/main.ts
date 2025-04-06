import '@/entries/enableDevHmr'

import { CSS_CLASS_NAMES } from '@/constants'
import { getAndListenStylesConfigStore } from '@/entries/contentScript/utils/config'
import type { StylesConfig } from '@/services/config'
import { objectEntries } from '@/utils/asserts'
import { toggleBodyClass } from '@/utils/dom'
import { devLog } from '@/utils/logging'
const { MV_PREMIUM, MV_PREMIUM_WITHOUT_BG, MV_ULTRA_WIDE } = CSS_CLASS_NAMES

const stylesConfig = await getAndListenStylesConfigStore(toggleStyles)
toggleStyles(stylesConfig)

function toggleStyles(stylesConfig: StylesConfig) {
  devLog.log('Toggling styles')
  objectEntries(stylesConfig).forEach(([key, value]) => {
    key === 'premiumEnabled' && toggleBodyClass(MV_PREMIUM, value)
    key === 'premiumBgDisabled' && toggleBodyClass(MV_PREMIUM_WITHOUT_BG, value)
    key === 'ultraWideEnabled' && toggleBodyClass(MV_ULTRA_WIDE, value)
  })
}
