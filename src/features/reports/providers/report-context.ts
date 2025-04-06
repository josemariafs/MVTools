import { createContext } from 'react'

import type { ReportElements } from '@/types/media-vida'

export const ReportContext = createContext<ReportElements | null>(null)
