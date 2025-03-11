import { SquareX } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { useAnalyzeComment } from '@/features/posts/hooks/use-analyze-comment'
import { usePostsStore } from '@/features/posts/hooks/use-posts-store'
import { ACTIONS } from '@/services/gemini'

export const Content = () => {
  const apiKey = usePostsStore(state => state.geminiApiKey)
  const { data: analyzedComment, isFetching, isError } = useAnalyzeComment({ action: ACTIONS.SUMMARY, apiKey })
  const [isClosed, setIsClosed] = useState(false)

  const text = useMemo(() => {
    if (isFetching) return 'Cargando...'
    if (isError) return 'Error al analizar el comentario'
    return analyzedComment
  }, [analyzedComment, isFetching, isError])

  useEffect(() => {
    isClosed && setIsClosed(false)
  }, [isFetching])

  const handleClick = () => {
    setIsClosed(true)
  }

  if (!text || !apiKey || isClosed) return null

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
