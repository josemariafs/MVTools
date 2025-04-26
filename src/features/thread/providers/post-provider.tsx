import { PostContext } from '@/features/thread/providers/post-context'
import { createContextProvider } from '@/utils/contexts'

export const PostProvider = createContextProvider(PostContext)
