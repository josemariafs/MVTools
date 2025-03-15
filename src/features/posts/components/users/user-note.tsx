import { StickyNote } from 'lucide-react'
import { useMemo } from 'react'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { usePostsConfigStore } from '@/features/posts/hooks/use-posts-config-store'
import { usePostContext } from '@/features/posts/providers/post-context-provider'
import { useShadowRootContext } from '@/providers/shadow-root-provider'

export const UserNote = () => {
  const userNotes = usePostsConfigStore(state => state.userNotes)
  const { shadowRoot } = useShadowRootContext()
  const { author } = usePostContext()
  const userNote = useMemo(() => userNotes.find(({ username }) => username === author)?.note, [author, userNotes])

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
        container={shadowRoot}
        side='bottom'
        className='max-w-96 text-balance text-left text-base'
      >
        {userNote}
      </TooltipContent>
    </Tooltip>
  )
}
