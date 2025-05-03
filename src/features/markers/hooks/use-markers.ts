import { createUseContext } from '@/utils/contexts'

import { MarkersContext } from '../providers/markers-context'

export const useMarkers = createUseContext(MarkersContext)
