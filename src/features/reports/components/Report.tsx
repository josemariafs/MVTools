import { Brain } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Portal } from '@/features/shared/components/portal'
import { AiButton, type AiButtonProps } from '@/features/shared/components/ui/ai-button'
import { AiMessage } from '@/features/shared/components/ui/ai-message'
import { ACTIONS } from '@/services/gemini'
import type { ReportElements } from '@/types/media-vida'
import { cn } from '@/utils/tailwind'

type Props = ReportElements['reportElements'][number]

const AnalyzeReportButton = (props: AiButtonProps) => (
  <Button
    defaultStyles
    className={cn([
      'inline-flex gap-0.5 rounded-[2px] bg-[#505658] px-2.5 py-1 text-xs font-normal leading-normal text-[#ecedef] border border-solid border-[#616b70]',
      'hover:bg-[#383c3d] hover:border-[#454c4f]',
      'disabled:pointer-events-none disabled:opacity-50',
      'shadow-[0 2px 0 rgba(0,0,0,.03)]'
    ])}
    {...props}
  >
    <Brain
      size={13}
      className='relative top-px'
    />
    analizar
  </Button>
)

export const Report = ({ id, buttonContainer, commentContainer, comment }: Props) => {
  return (
    <>
      <Portal
        root={buttonContainer}
        where='beforebegin'
        styles={{ display: 'inline-block' }}
      >
        <AiButton
          action={ACTIONS.RULES}
          comment={comment}
          id={id}
          button={AnalyzeReportButton}
        />
      </Portal>
      <Portal root={commentContainer}>
        <AiMessage
          className='mt-4'
          action={ACTIONS.RULES}
          comment={comment}
          id={id}
          renderAsHtml
        />
      </Portal>
    </>
  )
}
