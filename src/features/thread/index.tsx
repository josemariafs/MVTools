import { useMemo } from 'react'

import { Portal } from '@/components/ui/portal'
import { Button } from '@/features/thread/components/ai/button'
import { Content } from '@/features/thread/components/ai/content'
import { Highlight } from '@/features/thread/components/users/highlight'
import { Ignore } from '@/features/thread/components/users/ignore'
import { Notes } from '@/features/thread/components/users/notes'
import { PostContextProvider } from '@/features/thread/providers/post-context-provider'
import { getPostsElements } from '@/services/media-vida'

export const Thread = () => {
  const posts = useMemo(getPostsElements, [])

  return posts.map(post => (
    <PostContextProvider
      key={post.id}
      {...post}
    >
      <Portal root={post.postContainer}>
        <Ignore />
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
