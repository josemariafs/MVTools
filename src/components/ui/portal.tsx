import '@/global.css'

import { type PropsWithChildren, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { type Theme, ThemeProvider } from '@/providers/theme-provider'
import { renderContent } from '@/utils/dom'

interface Props extends PropsWithChildren {
  root: HTMLElement
  theme?: Theme
}

export const Portal = ({ children, root, theme }: Props) => {
  const [shadowRoot, setShadowRoot] = useState<HTMLElement | null>(null)

  useEffect(() => {
    renderContent(import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS, root, setShadowRoot)
  }, [])

  if (!shadowRoot) return null

  return createPortal(
    <ThemeProvider
      root={shadowRoot}
      defaultTheme={theme ?? 'light'}
    >
      {children}
    </ThemeProvider>,
    shadowRoot
  )
}
