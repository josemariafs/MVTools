import { createContext, type ReactNode, useContext, useEffect, useState } from 'react'

const THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
  SYSTEM: 'system'
} as const

export type Theme = (typeof THEMES)[keyof typeof THEMES]

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: Theme
  root?: HTMLElement
}

interface ThemeProviderState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: THEMES.SYSTEM,
  setTheme: () => null
}

const ThemeProviderContext = createContext<ThemeProviderState | null>(initialState)

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

  const value = {
    theme,
    setTheme
  }

  return (
    <ThemeProviderContext.Provider
      {...props}
      value={value}
    >
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context == null) throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
