import { type PropsWithChildren, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { TooltipProvider } from '@/components/ui/tooltip'
import { ShadowRootProvider } from '@/features/shared/providers/shadow-root-provider'
import type { Theme } from '@/providers/theme-context'
import { ThemeProvider } from '@/providers/theme-provider'
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
        <ShadowRootProvider appRoot={appRoot}>{children}</ShadowRootProvider>
      </TooltipProvider>
    </ThemeProvider>,
    appRoot
  )
}
