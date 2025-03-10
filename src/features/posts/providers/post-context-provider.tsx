import { createContext, type PropsWithChildren, useContext, useMemo } from 'react'

interface PostData {
  id: string
  comment: string
}

const PostContext = createContext<PostData | null>(null)

export const PostContextProvider = ({ children, comment, id }: PropsWithChildren<PostData>) => {
  const config = useMemo(() => ({ comment, id }), [comment, id])
  return <PostContext.Provider value={config}>{children}</PostContext.Provider>
}
export const usePostContext = () => {
  const context = useContext(PostContext)

  if (context == null) {
    throw new Error('usePostContext must be used within a PostContextProvider')
  }

  return { ...context }
}
