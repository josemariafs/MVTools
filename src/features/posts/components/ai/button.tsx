import { Brain } from 'lucide-react'

import { Button as CommonButton } from '@/components/ui/button'
import { AI_MIN_POST_LENGTH } from '@/constants'
import { useAnalyzeComment } from '@/features/posts/hooks/use-analyze-comment'
import { usePostsConfigStore } from '@/features/posts/hooks/use-posts-config-store'
import { usePostContext } from '@/features/posts/providers/post-context-provider'
import { ACTIONS } from '@/services/gemini'

export const Button = () => {
  const { comment } = usePostContext()
  const apiKey = usePostsConfigStore(state => state.geminiApiKey)
  const { refetch, isFetching } = useAnalyzeComment({ action: ACTIONS.SUMMARY, apiKey })
  const isVisible = !!apiKey && comment.length > AI_MIN_POST_LENGTH

  const handleClick = () => {
    refetch()
  }

  if (!isVisible) return null

  return (
    <CommonButton
      variant='outline'
      size='icon'
      onClick={handleClick}
      className='size-8 rounded-none border-none text-[#b9c8ce] hover:bg-[#6e6a66] hover:text-[#b9c8ce]'
      title='Resumir post'
      disabled={isFetching}
    >
      <Brain />
    </CommonButton>
  )
}
