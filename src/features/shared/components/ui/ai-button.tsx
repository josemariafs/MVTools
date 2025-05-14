import type { ReactElement } from 'react'

import type { ButtonProps } from '@/components/ui/button'
import { useAnalyzeComment } from '@/features/shared/hooks/use-analyze-comment'
import { useGlobalConfigStore } from '@/features/shared/hooks/use-global-config-store'
import type { Action } from '@/services/gemini'

export interface AiButtonProps {
  disabled: boolean
  onClick: () => void
}

interface Props {
  action: Action
  comment: string
  id: string | number
  maxCommentLength?: number
  button: (props: AiButtonProps) => ReactElement<ButtonProps>
}

export const AiButton = ({ action, comment, id, maxCommentLength, button }: Props) => {
  const { apiKey, model } = useGlobalConfigStore(state => ({ apiKey: state.geminiApiKey, model: state.geminiModel }))
  const { refetch, isFetching } = useAnalyzeComment({ action, apiKey, model, comment, id })
  const isVisible = !!apiKey && (maxCommentLength ? comment.length > maxCommentLength : true)

  const handleClick = () => {
    refetch()
  }

  if (!isVisible) return null

  return button({
    disabled: isFetching,
    onClick: handleClick
  })
}
