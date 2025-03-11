import { Store } from '@tanstack/react-store'

import { DEFAULT_POSTS_CONFIG } from '@/constants'
import type { PostsConfig } from '@/services/config'

export const postsConfigStore = new Store<PostsConfig>(DEFAULT_POSTS_CONFIG)

export const updatePostsConfigStore = (postsConfig: PostsConfig) => {
  postsConfigStore.setState(state => ({ ...state, ...postsConfig }))
}
