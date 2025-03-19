import { createContext, type PropsWithChildren, useContext, useMemo } from 'react'

import type { PostElements } from '@/services/media-vida'

const PostContext = createContext<PostElements | null>(null)

export const PostContextProvider = ({ children, ...rest }: PropsWithChildren<PostElements>) => {
  const config = useMemo(() => ({ ...rest }), [rest])
  return <PostContext.Provider value={config}>{children}</PostContext.Provider>
}
export const usePostContext = () => {
  const context = useContext(PostContext)

  if (context == null) {
    throw new Error('usePostContext must be used within a PostContextProvider')
  }

  return { ...context }
}
