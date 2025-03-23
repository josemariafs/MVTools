import { createContext } from 'react'

import type { ReportElements } from '@/services/media-vida'

export const ReportContext = createContext<ReportElements | null>(null)
