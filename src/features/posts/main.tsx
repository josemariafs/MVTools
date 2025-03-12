import '@/entries/enableDevHmr'

import ReactDOM, { type Root } from 'react-dom/client'

import { Posts } from '@/features/posts'
import { PostsContextProvider } from '@/features/posts/providers/posts-context-provider'
import { DefaultQueryClientProvider } from '@/providers/query-client-provider'
import { getPostsElements } from '@/services/media-vida'

let root: Root | null = null
let appRoot: HTMLElement | null = null

export const renderPosts = () => {
  unmount()
  const posts = getPostsElements()
  if (!posts.length) return

  appRoot = document.createElement('div')
  root = ReactDOM.createRoot(appRoot)
  root.render(
    <DefaultQueryClientProvider>
      <PostsContextProvider posts={posts}>
        <Posts />
      </PostsContextProvider>
    </DefaultQueryClientProvider>
  )
}

const unmount = () => {
  root?.unmount()
  appRoot?.remove()
}
