import { type PropsWithChildren, useEffect, useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { useShadowRoot } from '@/features/shared/hooks/use-shadow-root'
import { useTheme } from '@/hooks/use-theme'
import { renderContent } from '@/utils/dom'
import { cn } from '@/utils/tailwind'

interface Props extends PropsWithChildren {
  root?: HTMLElement
  where?: InsertPosition
  styles?: Partial<CSSStyleDeclaration>
  className?: string
  title?: string
}

export const Portal = ({ children, root, where, styles, className, title }: Props) => {
  const { cssPaths } = useShadowRoot()
  const { theme } = useTheme()
  const [appRoot, setAppRoot] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!root) return
    renderContent({ cssPaths, render: setAppRoot, container: root, where, styles, title })
  }, [root])

  useLayoutEffect(() => {
    if (!appRoot) return
    appRoot.className = cn(className, theme)
  }, [theme, appRoot])

  if (!appRoot) return null

  return createPortal(children, appRoot)
}
