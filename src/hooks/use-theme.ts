import { useContext, useEffect } from 'react'

import { type Theme, ThemeContext } from '@/providers/theme-context'

export const useTheme = (theme?: Theme) => {
  const context = useContext(ThemeContext)

  if (context == null) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  useEffect(() => {
    theme && context.setTheme(theme)
  }, [theme])

  return context
}
