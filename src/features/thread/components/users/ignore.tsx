import { useState } from 'react'

import { CSS_SELECTORS } from '@/constants'
import { Portal } from '@/features/shared/components/portal'
import { IgnoreUser } from '@/features/shared/components/ui/ignore-user'
import { useMutationObserver } from '@/features/shared/hooks/use-mutation-observer'
import { usePostContext } from '@/features/thread/hooks/use-post'
import { getPostRepliesElements } from '@/services/media-vida'
import type { PostReplyElements } from '@/types/media-vida'
import { searchMutationListFor } from '@/utils/dom'

export const Ignore = () => {
  const { postContainer, postAvatarContainer, postBodyContainer, author } = usePostContext()
  const [replies, setReplies] = useState<PostReplyElements[]>([])

  useMutationObserver({
    target: postContainer,
    callback: mutations => {
      const replies = searchMutationListFor(mutations, CSS_SELECTORS.REPLIES.MAIN_CONTAINER)
      if (!replies.length) return

      const newReplies = getPostRepliesElements(replies)
      setReplies(oldReplies => {
        const newRepliesIds = newReplies.map(({ id }) => id)
        return oldReplies.filter(({ id }) => !newRepliesIds.includes(id)).concat(newReplies)
      })
    },
    onUnmount: () => {
      setReplies([])
    }
  })

  return (
    <>
      <IgnoreUser
        type='post'
        parentElement={postContainer}
        toggleElements={[postAvatarContainer, postBodyContainer]}
        author={author}
      />
      {replies.map(({ replyContainer, id, author, ...rest }) => (
        <Portal
          root={replyContainer}
          key={id}
        >
          <IgnoreUser
            type='reply'
            parentElement={replyContainer}
            toggleElements={Object.values(rest).filter(Boolean)}
            author={author}
          />
        </Portal>
      ))}
    </>
  )
}
