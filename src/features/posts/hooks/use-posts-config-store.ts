import { useStore } from '@tanstack/react-store'

import type { PostsConfig } from '@/services/config'
import { postsConfigStore } from '@/store/posts-config-store'

export const usePostsConfigStore = <TSelected>(selector: (state: PostsConfig) => TSelected): TSelected =>
  useStore(postsConfigStore, selector)
