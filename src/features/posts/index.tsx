import { useMemo } from 'react'

import { Portal } from '@/components/ui/portal'
import { Button } from '@/features/posts/components/ai/button'
import { Content } from '@/features/posts/components/ai/content'
import { HighlightUser } from '@/features/posts/components/users/highlight-user'
import { IgnoreUser } from '@/features/posts/components/users/Ignore-user'
import { UserNote } from '@/features/posts/components/users/user-note'
import { PostContextProvider } from '@/features/posts/providers/post-context-provider'
import { getPostsElements } from '@/services/media-vida'

export const Posts = () => {
  const posts = useMemo(getPostsElements, [])

  return posts.map(post => (
    <PostContextProvider
      key={post.id}
      {...post}
    >
      <Portal root={post.postContainer}>
        <IgnoreUser />
      </Portal>
      <Portal root={post.userNotesContainer}>
        <UserNote />
      </Portal>
      <HighlightUser />
      <Portal root={post.aiButtonContainer}>
        <Button />
      </Portal>
      <Portal root={post.aiContentContainer}>
        <Content />
      </Portal>
    </PostContextProvider>
  ))
}
