import { useMemo } from 'react'

import { Portal } from '@/features/shared/components/portal'
import { IA } from '@/features/thread/components/ia'
import { Highlight } from '@/features/thread/components/users/highlight'
import { Ignore } from '@/features/thread/components/users/ignore'
import { Notes } from '@/features/thread/components/users/notes'
import { PostProvider } from '@/features/thread/providers/post-provider'
import { useTheme } from '@/hooks/use-theme'
import { getPostsElements } from '@/services/media-vida'

export const Thread = () => {
  const posts = useMemo(getPostsElements, [])
  useTheme('light')

  return posts.map(post => (
    <PostProvider
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
      <IA />
    </PostProvider>
  ))
}
