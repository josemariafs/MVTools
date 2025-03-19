import '@/entries/enableDevHmr'

import type { ReactNode } from 'react'
import ReactDOM, { type Root } from 'react-dom/client'

import { PrivateMessages } from '@/features/private-messages/index'
import { Thread } from '@/features/thread'
import { DefaultQueryClientProvider } from '@/providers/query-client-provider'

let root: Root | null = null
let appRoot: HTMLElement | null = null

export const MODULES = {
  THREAD: 'thread',
  PRIVATE_MESSAGES: 'private-messages'
} as const

type Module = (typeof MODULES)[keyof typeof MODULES]

const MODULE_COMPONENT: Record<Module, ReactNode> = {
  [MODULES.THREAD]: <Thread />,
  [MODULES.PRIVATE_MESSAGES]: <PrivateMessages />
} as const

export const renderApp = (module: Module) => {
  unmount()
  appRoot = document.createElement('div')
  root = ReactDOM.createRoot(appRoot)
  root.render(<DefaultQueryClientProvider>{MODULE_COMPONENT[module]}</DefaultQueryClientProvider>)
}

const unmount = () => {
  root?.unmount()
  appRoot?.remove()
}
