import { SquareX } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { useAnalyzeComment } from '@/features/shared/hooks/use-analyze-comment'
import { useGlobalConfigStore } from '@/features/shared/hooks/use-global-config-store'
import type { Action } from '@/services/gemini'
import { cn } from '@/utils/tailwind'

interface Props {
  action: Action
  comment: string
  id: string | number
  maxCommentLength?: number
  renderAsHtml?: boolean
  className?: string
}

// eslint-disable-next-line complexity -- We need to handle different states
export const AiMessage = ({ action, comment, id, maxCommentLength = 0, renderAsHtml = false, className }: Props) => {
  const apiKey = useGlobalConfigStore(state => state.geminiApiKey)
  const { data: analyzedComment, isFetching, isError, error } = useAnalyzeComment({ action, apiKey, comment, id })
  const [isClosed, setIsClosed] = useState(false)

  const text = useMemo(() => {
    if (isFetching) return 'Cargando...'
    if (isError) return error.message
    return analyzedComment
  }, [analyzedComment, isFetching, isError])

  const hasData = !!analyzedComment && !isFetching && !isError
  const isVisible = !!apiKey && !isClosed && !!text && (maxCommentLength > 0 ? comment.length >= maxCommentLength : true)

  useEffect(() => {
    isClosed && setIsClosed(false)
  }, [isFetching])

  const handleClick = () => {
    setIsClosed(true)
  }

  if (!isVisible) return null

  return (
    <div className={cn('relative', className)}>
      {!isFetching && (
        <Button
          className='hover:text-gray absolute -right-1.5 -top-1.5 size-fit border-none bg-[#2a3237] hover:bg-transparent'
          variant='outline'
          size='icon'
          onClick={handleClick}
        >
          <SquareX />
        </Button>
      )}
      <div
        className='items-center justify-between space-y-3 border-l-2 border-l-[#1f2529] bg-[#2a3237] p-2.5 shadow-sm'
        dangerouslySetInnerHTML={hasData && renderAsHtml ? { __html: analyzedComment } : undefined}
      >
        {!renderAsHtml ? text : !hasData ? text : null}
      </div>
    </div>
  )
}
