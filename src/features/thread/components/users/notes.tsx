import { StickyNote } from 'lucide-react'
import { useMemo } from 'react'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useGlobalConfigStore } from '@/features/shared/hooks/use-global-config-store'
import { useShadowRoot } from '@/features/shared/hooks/use-shadow-root'
import { usePostContext } from '@/features/thread/hooks/use-post'

export const Notes = () => {
  const userNotes = useGlobalConfigStore(state => state.userNotes)
  const { appRoot } = useShadowRoot()
  const { author } = usePostContext()
  const userNote = useMemo(
    () => userNotes.find(({ username }) => username.toLowerCase() === author.toLowerCase())?.note,
    [author, userNotes]
  )

  if (!userNote) return null

  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger asChild>
        <Button
          type='button'
          variant='ghost'
          size='lg'
          className='size-full px-3 py-2 text-orange-500 hover:bg-transparent'
        >
          <StickyNote />
        </Button>
      </TooltipTrigger>
      <TooltipContent
        container={appRoot}
        side='bottom'
        dark
        className='max-w-72 text-pretty text-base'
      >
        {userNote}
      </TooltipContent>
    </Tooltip>
  )
}
