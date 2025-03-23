import { PostContext } from '@/features/thread/providers/post-context'
import { createUseContext } from '@/utils/contexts'

export const usePostContext = createUseContext(PostContext)
