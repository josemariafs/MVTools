import { Brain } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { AI_MIN_POST_LENGTH } from '@/constants'
import { Portal } from '@/features/shared/components/portal'
import { AiButton, type AiButtonProps } from '@/features/shared/components/ui/ai-button'
import { AiMessage } from '@/features/shared/components/ui/ai-message'
import { usePostContext } from '@/features/thread/hooks/use-post'
import { ACTIONS } from '@/services/gemini'

const AnalyzePostButton = (props: AiButtonProps) => (
  <Button
    variant='postButton'
    size='postIcon'
    title='Resumir post'
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
