import '@/entries/enableDevHmr'
import '@/entries/contentScript/global.css'

import type { ReactNode } from 'react'
import ReactDOM, { type Root } from 'react-dom/client'

import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { type Module, MODULES, THREAD_LIST_TYPES } from '@/constants'
import { Clones } from '@/features/clones'
import { PinnedThreads } from '@/features/pinned-threads'
import { PrivateMessages } from '@/features/private-messages'
import { Reports } from '@/features/reports'
import { ShadowRootProvider } from '@/features/shared/providers/shadow-root-provider'
import { Thread } from '@/features/thread'
import { DefaultQueryClientProvider } from '@/providers/query-client-provider'
import { ThemeProvider } from '@/providers/theme-provider'
import { appendSonnerStyles, renderContent } from '@/utils/dom'

let root: Root | null = null
let mainAppRoot: HTMLElement | null = null

const MODULE_COMPONENT: Record<Module, ReactNode> = {
  [MODULES.THREAD]: <Thread />,
  [MODULES.PRIVATE_MESSAGES]: <PrivateMessages />,
  [MODULES.REPORTS]: <Reports />,
  [MODULES.CLONES]: <Clones />,
  [MODULES.FAVORITES]: <PinnedThreads type={THREAD_LIST_TYPES.FAVORITES} />,
  [MODULES.IGNORED]: <PinnedThreads type={THREAD_LIST_TYPES.IGNORED} />
} as const

export const renderApp = (module: Module) =>
  renderContent({
    cssPaths: import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS,
    render: (appRoot, shadowRoot) => {
      unmount()
      mainAppRoot = appRoot

      appendSonnerStyles(shadowRoot)
      root = ReactDOM.createRoot(appRoot)
      root.render(
        <DefaultQueryClientProvider shadowDOMTarget={shadowRoot}>
          <ShadowRootProvider appRoot={appRoot}>
            <ThemeProvider
              root={mainAppRoot}
              defaultTheme='dark'
            >
              <TooltipProvider>
                <Toaster closeButton />
                {MODULE_COMPONENT[module]}
              </TooltipProvider>
            </ThemeProvider>
          </ShadowRootProvider>
        </DefaultQueryClientProvider>
      )
    }
  })

const unmount = () => {
  root?.unmount()
  mainAppRoot?.remove()
}
