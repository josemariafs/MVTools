import { useState } from 'react'

import { Portal } from '@/components/ui/portal'
import { IgnoreUser } from '@/features/posts/components/users/Ignore-user'
import { usePostsConfigStore } from '@/features/posts/hooks/use-posts-config-store'
import { usePostContext } from '@/features/posts/providers/post-context-provider'
import { useMutationObserver } from '@/hooks/use-mutation-observer'
import { getPostRepliesElements, type PostReplyElements } from '@/services/media-vida'
import { searchMutationListFor } from '@/utils/dom'

export const IgnoreUsers = () => {
  const { postContainer, postAvatarContainer, postBodyContainer, author } = usePostContext()
  const ignoredUsers = usePostsConfigStore(state => state.ignoredUsers)
  const [replies, setReplies] = useState<PostReplyElements[]>([])

  useMutationObserver({
    target: postContainer,
    deps: [ignoredUsers],
    callback: mutations => {
      const replies = searchMutationListFor(mutations, '.rep')
      if (!replies.length) return
      setReplies(getPostRepliesElements(replies))
    }
  })

  return (
    <>
      <IgnoreUser
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
              toggleElements={[replyBodyContainer, replyAvatarContainer, replyMetaContainer, replyPostControlsContainer].filter(Boolean)}
              author={author}
            />
          </Portal>
        )
      )}
    </>
  )
}
