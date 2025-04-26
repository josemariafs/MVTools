import type { ReactNode } from 'react'
import ReactDOM, { type Root } from 'react-dom/client'

import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ShadowRootProvider } from '@/features/shared/providers/shadow-root-provider'
import { DefaultQueryClientProvider } from '@/providers/query-client-provider'
import { ThemeProvider } from '@/providers/theme-provider'
import { appendSonnerStyles, renderContent } from '@/utils/dom'

let root: Root | null = null
let mainAppRoot: HTMLElement | null = null

export const renderApp = (app: ReactNode, cssPaths: string[]) => {
  renderContent({
    cssPaths,
    render: (appRoot, shadowRoot) => {
      unmount()
      mainAppRoot = appRoot

      appendSonnerStyles(shadowRoot)
      root = ReactDOM.createRoot(appRoot)
      root.render(
        <DefaultQueryClientProvider shadowDOMTarget={shadowRoot}>
          <ShadowRootProvider
            appRoot={appRoot}
            cssPaths={cssPaths}
          >
            <ThemeProvider
              root={mainAppRoot}
              defaultTheme='dark'
            >
              <TooltipProvider>
                <Toaster closeButton />
                {app}
              </TooltipProvider>
            </ThemeProvider>
          </ShadowRootProvider>
        </DefaultQueryClientProvider>
      )
    }
  })
}

const unmount = () => {
  root?.unmount()
  mainAppRoot?.remove()
}
