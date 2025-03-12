import { Portal } from '@/components/ui/portal'
import { Button } from '@/features/posts/components/ai/button'
import { Content } from '@/features/posts/components/ai/content'
import { PostContextProvider } from '@/features/posts/providers/post-context-provider'
import { usePostsContext } from '@/features/posts/providers/posts-context-provider'

export const Posts = () => {
  const { posts } = usePostsContext()

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
