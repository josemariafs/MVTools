import { Brain } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Portal } from '@/components/ui/portal'
import { AI_MIN_POST_LENGTH } from '@/constants'
import { AiButton, type AiButtonProps } from '@/features/components/ai-button'
import { AiMessage } from '@/features/components/ai-message'
import { usePostContext } from '@/features/thread/providers/post-context-provider'
import { ACTIONS } from '@/services/gemini'

const AnalyzePostButton = (props: AiButtonProps) => (
  <Button
    variant='outline'
    size='icon'
    className='size-8 rounded-none border-none text-[#b9c8ce] hover:bg-[#6e6a66] hover:text-[#b9c8ce]'
    {...props}
  >
    <Brain />
  </Button>
)

export const IA = () => {
  const { postButtonsContainer, commentContainer, id, comment } = usePostContext()

  return (
    <>
      <Portal
        root={postButtonsContainer}
        where='afterbegin'
        styles={{ listStyle: 'none', float: 'left', padding: '0', position: 'relative', marginRight: '2px' }}
      >
        <AiButton
          id={id}
          action={ACTIONS.SUMMARY}
          comment={comment}
          maxCommentLength={AI_MIN_POST_LENGTH}
          button={AnalyzePostButton}
        />
      </Portal>
      <Portal root={commentContainer}>
        <AiMessage
          id={id}
          action={ACTIONS.SUMMARY}
          comment={comment}
          maxCommentLength={AI_MIN_POST_LENGTH}
        />
      </Portal>
    </>
  )
}
