import '@/entries/enableDevHmr'
import '@/global.css'

import type { ReactNode } from 'react'
import ReactDOM, { type Root } from 'react-dom/client'

import { PrivateMessages } from '@/features/private-messages/index'
import { Reports } from '@/features/reports'
import { Thread } from '@/features/thread'
import { DefaultQueryClientProvider } from '@/providers/query-client-provider'

let root: Root | null = null
let appRoot: HTMLElement | null = null

export const MODULES = {
  THREAD: 'thread',
  PRIVATE_MESSAGES: 'private-messages',
  REPORTS: 'reports'
} as const

type Module = (typeof MODULES)[keyof typeof MODULES]

const MODULE_COMPONENT: Record<Module, ReactNode> = {
  [MODULES.THREAD]: <Thread />,
  [MODULES.PRIVATE_MESSAGES]: <PrivateMessages />,
  [MODULES.REPORTS]: <Reports />
} as const

export const renderApp = (module: Module) => {
  unmount()
  appRoot = document.createElement('div')

  // Add the root to the body only in development mode to get devtools to work
  import.meta.env.MODE === 'development' && document.body.append(appRoot)

  root = ReactDOM.createRoot(appRoot)
  root.render(<DefaultQueryClientProvider>{MODULE_COMPONENT[module]}</DefaultQueryClientProvider>)
}

const unmount = () => {
  root?.unmount()
  appRoot?.remove()
}
