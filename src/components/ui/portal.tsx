import { type PropsWithChildren, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { TooltipProvider } from '@/components/ui/tooltip'
import { ShadowRootContextProvider } from '@/providers/shadow-root-provider'
import { type Theme, ThemeProvider } from '@/providers/theme-provider'
import { renderContent } from '@/utils/dom'

interface Props extends PropsWithChildren {
  root?: HTMLElement
  where?: InsertPosition
  styles?: Partial<CSSStyleDeclaration>
  theme?: Theme
}

export const Portal = ({ children, root, where, styles, theme }: Props) => {
  const [appRoot, setAppRoot] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!root) return
    import('@/global.css')
    renderContent({
      cssPaths: import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS,
      render: setAppRoot,
      container: root,
      where,
      styles
    })
  }, [root])

  if (!appRoot) return null

  return createPortal(
    <ThemeProvider
      root={appRoot}
      defaultTheme={theme ?? 'light'}
    >
      <TooltipProvider>
        <ShadowRootContextProvider appRoot={appRoot}>{children}</ShadowRootContextProvider>
      </TooltipProvider>
    </ThemeProvider>,
    appRoot
  )
}
