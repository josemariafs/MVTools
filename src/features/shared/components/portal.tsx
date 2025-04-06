import { type PropsWithChildren, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { useShadowRoot } from '@/features/shared/hooks/use-shadow-root'
import { useTheme } from '@/hooks/use-theme'
import { renderContent } from '@/utils/dom'

interface Props extends PropsWithChildren {
  root?: HTMLElement
  where?: InsertPosition
  styles?: Partial<CSSStyleDeclaration>
}

export const Portal = ({ children, root, where, styles }: Props) => {
  const { cssPaths } = useShadowRoot()
  const { theme } = useTheme()
  const [appRoot, setAppRoot] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!root) return
    renderContent({ cssPaths, render: setAppRoot, container: root, where, styles })
  }, [root])

  useEffect(() => {
    appRoot?.classList.add(theme)
  }, [theme, appRoot])

  if (!appRoot) return null

  return createPortal(children, appRoot)
}
