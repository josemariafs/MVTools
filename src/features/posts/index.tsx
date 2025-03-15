import { useMemo } from 'react'

import { Portal } from '@/components/ui/portal'
import { Button } from '@/features/posts/components/ai/button'
import { Content } from '@/features/posts/components/ai/content'
import { HighlightUser } from '@/features/posts/components/users/highlight-user'
import { IgnoreUsers } from '@/features/posts/components/users/ignore'
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
        <IgnoreUsers />
      </Portal>
      <Portal root={post.postAvatarContainer}>
        <UserNote />
      </Portal>
      <HighlightUser />
      <Portal
        root={post.postButtonsContainer}
        where='afterbegin'
        styles={{ listStyle: 'none', float: 'left', padding: '0', position: 'relative', marginRight: '2px' }}
      >
        <Button />
      </Portal>
      <Portal root={post.postBodyContainer}>
        <Content />
      </Portal>
    </PostContextProvider>
  ))
}
