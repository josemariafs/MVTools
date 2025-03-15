import { useMemo } from 'react'

import { Portal } from '@/components/ui/portal'
import { Button } from '@/features/posts/components/ai/button'
import { Content } from '@/features/posts/components/ai/content'
import { Highlight } from '@/features/posts/components/users/highlight'
import { IgnoreUsers } from '@/features/posts/components/users/ignore'
import { Notes } from '@/features/posts/components/users/notes'
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
        <Notes />
      </Portal>
      <Highlight />
      <Portal
        root={post.postButtonsContainer}
        where='afterbegin'
        styles={{ listStyle: 'none', float: 'left', padding: '0', position: 'relative', marginRight: '2px' }}
      >
        <Button />
      </Portal>
      <Portal root={post.commentContainer}>
        <Content />
      </Portal>
    </PostContextProvider>
  ))
}
