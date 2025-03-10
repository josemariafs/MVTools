import '@/entries/enableDevHmr'

import ReactDOM, { type Root } from 'react-dom/client'

import { Posts } from '@/features/posts/components/posts'
import { PostsContextProvider } from '@/features/posts/providers/posts-context-provider'
import { DefaultQueryClientProvider } from '@/providers/query-client-provider'

let root: Root | null = null
let appRoot: HTMLElement | null = null

export const renderPostsAi = (apiKey: string) => {
  unmount()
  if (!apiKey) return

  appRoot = document.createElement('div')
  root = ReactDOM.createRoot(appRoot)
  root.render(
    <DefaultQueryClientProvider>
      <PostsContextProvider apiKey={apiKey}>
        <Posts />
      </PostsContextProvider>
    </DefaultQueryClientProvider>
  )
}

const unmount = () => {
  root?.unmount()
  appRoot?.remove()
}
