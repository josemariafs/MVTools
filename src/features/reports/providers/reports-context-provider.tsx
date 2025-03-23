import { createContext, type PropsWithChildren, useContext, useMemo } from 'react'

import type { ReportElements } from '@/services/media-vida'

const ReportContext = createContext<ReportElements | null>(null)

export const ReportContextProvider = ({ children, ...rest }: PropsWithChildren<ReportElements>) => {
  const config = useMemo(() => ({ ...rest }), [rest])
  return <ReportContext.Provider value={config}>{children}</ReportContext.Provider>
}
export const useReportContext = () => {
  const context = useContext(ReportContext)

  if (context == null) {
    throw new Error('useReportContext must be used within a ReportContextProvider')
  }

  return { ...context }
}
