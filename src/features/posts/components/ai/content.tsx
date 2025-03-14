import { SquareX } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { AI_MIN_POST_LENGTH } from '@/constants'
import { useAnalyzeComment } from '@/features/posts/hooks/use-analyze-comment'
import { usePostsConfigStore } from '@/features/posts/hooks/use-posts-config-store'
import { usePostContext } from '@/features/posts/providers/post-context-provider'
import { ACTIONS } from '@/services/gemini'

export const Content = () => {
  const { comment } = usePostContext()
  const apiKey = usePostsConfigStore(state => state.geminiApiKey)
  const { data: analyzedComment, isFetching, isError } = useAnalyzeComment({ action: ACTIONS.SUMMARY, apiKey })
  const [isClosed, setIsClosed] = useState(false)

  const text = useMemo(() => {
    if (isFetching) return 'Cargando...'
    if (isError) return 'Error al analizar el comentario'
    return analyzedComment
  }, [analyzedComment, isFetching, isError])

  const isVisible = !!apiKey && comment.length > AI_MIN_POST_LENGTH && !isClosed && !!text

  useEffect(() => {
    isClosed && setIsClosed(false)
  }, [isFetching])

  const handleClick = () => {
    setIsClosed(true)
  }

  if (!isVisible) return null

  return (
    <div className='relative'>
      {!isFetching && (
        <Button
          className='absolute right-px top-0.5 size-fit border-none bg-transparent hover:bg-transparent hover:text-[#5e666e]'
          variant='outline'
          size='icon'
          onClick={handleClick}
        >
          <SquareX />
        </Button>
      )}
      <div className='items-center justify-between space-y-3 border-l-2 border-l-[#1f2529] bg-[#2a3237] p-2.5 shadow-sm'>{text}</div>
    </div>
  )
}
