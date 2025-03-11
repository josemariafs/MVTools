import { createContext, type PropsWithChildren, useContext, useMemo } from 'react'

import type { PostElements } from '@/services/media-vida'

interface PostsData {
  posts: PostElements[]
}

const PostsContext = createContext<PostsData | null>(null)

export const PostsContextProvider = ({ children, posts }: PropsWithChildren<PostsData>) => {
  const config = useMemo(() => ({ posts }), [posts])
  return <PostsContext.Provider value={config}>{children}</PostsContext.Provider>
}
export const usePostsContext = () => {
  const context = useContext(PostsContext)

  if (context == null) {
    throw new Error('usePostsContext must be used within a PostsContextProvider')
  }

  return { ...context }
}
