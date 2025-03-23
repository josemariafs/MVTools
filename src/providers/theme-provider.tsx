import { type ReactNode, useEffect, useMemo, useState } from 'react'

import { type Theme, ThemeContext } from '@/providers/theme-context'

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: Theme
  root?: HTMLElement
}

export function ThemeProvider({ children, defaultTheme = 'system', root = window.document.documentElement, ...props }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)

  useEffect(() => {
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme])
  return (
    <ThemeContext
      {...props}
      value={value}
    >
      {children}
    </ThemeContext>
  )
}
