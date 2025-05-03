import { createContext } from 'react'

import type { MarkersElements } from '@/types/media-vida'

export const MarkersContext = createContext<MarkersElements | null>(null)
