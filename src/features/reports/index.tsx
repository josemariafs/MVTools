import { useMemo } from 'react'

import { Portal } from '@/components/ui/portal'
import { Report } from '@/features/reports/components/Report'
import { ReportContextProvider } from '@/features/reports/providers/reports-context-provider'
import { getReportsElements } from '@/services/media-vida'

import { AnalyzeReports } from './components/AnalyzeReports'

export const Reports = () => {
  const reportsElements = useMemo(getReportsElements, [])

  return (
    <ReportContextProvider {...reportsElements}>
      <Portal
        root={reportsElements.title}
        styles={{ display: 'inline-block', marginBottom: '10px' }}
      >
        <AnalyzeReports />
      </Portal>
      {reportsElements.reportElements.map(report => (
        <Report
          key={report.id}
          {...report}
        />
      ))}
    </ReportContextProvider>
  )
}
