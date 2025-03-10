import { createContext, type PropsWithChildren, useContext, useMemo } from 'react'

interface PostsData {
  apiKey: string
}

const PostsContext = createContext<PostsData | null>(null)

export const PostsContextProvider = ({ children, apiKey }: PropsWithChildren<PostsData>) => {
  const config = useMemo(() => ({ apiKey }), [apiKey])
  return <PostsContext.Provider value={config}>{children}</PostsContext.Provider>
}
export const usePostsContext = () => {
  const context = useContext(PostsContext)

  if (context == null) {
    throw new Error('usePostsContext must be used within a PostsContextProvider')
  }

  return { ...context }
}
