import { TriangleAlert } from 'lucide-react'
import { useCallback } from 'react'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useAnalyzeComments } from '@/features/hooks/use-analyze-comment'
import { useGlobalConfigStore } from '@/features/hooks/use-global-config-store'
import { useReportContext } from '@/features/reports/providers/reports-context-provider'
import { useShadowRootContext } from '@/providers/shadow-root-provider'
import { ACTIONS } from '@/services/gemini'
import { cn } from '@/utils/tailwind'

export const AnalyzeReports = () => {
  const { appRoot } = useShadowRootContext()
  const apiKey = useGlobalConfigStore(state => state.geminiApiKey)
  const { reportElements } = useReportContext()
  const { pending, refetch } = useAnalyzeComments({
    apiKey,
    comments: reportElements.map(({ comment, id }) => ({ comment, id, action: ACTIONS.RULES }))
  })

  const handleClick = useCallback(() => {
    refetch()
  }, [refetch])

  if (!apiKey) return null

  return (
    <Tooltip>
      <Button
        defaultStyles
        className={cn([
          'bg-[#505658] px-3 py-[5px] ml-4 leading-normal rounded-[2px] text-sm font-semibold text-[#ecedef] border border-solid border-[#616b70]',
          'hover:bg-[#383c3d] hover:border-[#454c4f]',
          'disabled:pointer-events-none disabled:opacity-50',
          'shadow-[0 2px 0 rgba(0,0,0,.03)]'
        ])}
        disabled={pending}
        onClick={handleClick}
      >
        Analizar reportes
      </Button>
      <TooltipTrigger>
        <TriangleAlert
          size={16}
          className='relative -left-2 -top-3 text-yellow-500'
        />
      </TooltipTrigger>
      <TooltipContent
        container={appRoot}
        side='right'
      >
        Usar con precaución. Puede hacer que tu quota de Gemini se agote.
      </TooltipContent>
    </Tooltip>
  )
}
