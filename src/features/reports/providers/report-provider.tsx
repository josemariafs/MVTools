import { ReportContext } from '@/features/reports/providers/report-context'
import { createContextProvider } from '@/utils/contexts'

export const ReportProvider = createContextProvider(ReportContext)
