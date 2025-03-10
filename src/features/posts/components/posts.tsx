import { useMemo } from 'react'

import { Portal } from '@/components/ui/portal'
import { Button } from '@/features/posts/components/ai/button'
import { Content } from '@/features/posts/components/ai/content'
import { PostContextProvider } from '@/features/posts/providers/post-context-provider'
import { getPostsElements } from '@/services/media-vida'

export const Posts = () => {
  const posts = useMemo(getPostsElements, [])

  return posts.map(post => (
    <PostContextProvider
      key={post.id}
      id={post.id}
      comment={post.comment}
    >
      <Portal root={post.buttonContainer}>
        <Button />
      </Portal>
      <Portal root={post.contentContainer}>
        <Content />
      </Portal>
    </PostContextProvider>
  ))
}
