import { useState } from 'react'

import { Portal } from '@/components/ui/portal'
import { CSS_SELECTORS } from '@/constants'
import { IgnoreUser } from '@/features/posts/components/users/ignore/ignore-user'
import { usePostContext } from '@/features/posts/providers/post-context-provider'
import { useMutationObserver } from '@/hooks/use-mutation-observer'
import { getPostRepliesElements, type PostReplyElements } from '@/services/media-vida'
import { searchMutationListFor } from '@/utils/dom'

export const IgnoreUsers = () => {
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
        parentElement={postContainer}
        toggleElements={[postAvatarContainer, postBodyContainer]}
        author={author}
      />
      {replies.map(
        ({ replyContainer, id, author, replyBodyContainer, replyAvatarContainer, replyMetaContainer, replyPostControlsContainer }) => (
          <Portal
            root={replyContainer}
            key={id}
          >
            <IgnoreUser
              parentElement={replyContainer}
              toggleElements={[replyBodyContainer, replyAvatarContainer, replyMetaContainer, replyPostControlsContainer].filter(Boolean)}
              author={author}
            />
          </Portal>
        )
      )}
    </>
  )
}
