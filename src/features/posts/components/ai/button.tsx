import { Brain } from 'lucide-react'

import { Button as CommonButton } from '@/components/ui/button'
import { useAnalyzeComment } from '@/features/posts/hooks/use-analyze-comment'
import { ACTIONS } from '@/services/gemini'

export const Button = () => {
  const { refetch, isFetching } = useAnalyzeComment({ action: ACTIONS.SUMMARY })

  const handleClick = () => {
    refetch()
  }

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
