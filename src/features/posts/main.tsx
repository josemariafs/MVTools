import '@/entries/enableDevHmr'

import ReactDOM, { type Root } from 'react-dom/client'

import { Posts } from '@/features/posts'
import { DefaultQueryClientProvider } from '@/providers/query-client-provider'

let root: Root | null = null
let appRoot: HTMLElement | null = null

export const renderPosts = () => {
  unmount()
  appRoot = document.createElement('div')
  root = ReactDOM.createRoot(appRoot)
  root.render(
    <DefaultQueryClientProvider>
      <Posts />
    </DefaultQueryClientProvider>
  )
}

const unmount = () => {
  root?.unmount()
  appRoot?.remove()
}
