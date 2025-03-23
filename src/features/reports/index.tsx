import { useMemo } from 'react'

import { Report } from '@/features/reports/components/Report'
import { ReportProvider } from '@/features/reports/providers/report-provider'
import { Portal } from '@/features/shared/components/portal'
import { getReportsElements } from '@/services/media-vida'

import { AnalyzeReports } from './components/AnalyzeReports'

export const Reports = () => {
  const reportsElements = useMemo(getReportsElements, [])

  return (
    <ReportProvider {...reportsElements}>
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
    </ReportProvider>
  )
}
