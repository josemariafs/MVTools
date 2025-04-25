import { ReportContext } from '@/features/reports/providers/report-context'
import { createUseContext } from '@/utils/contexts'

export const useReport = createUseContext(ReportContext)
