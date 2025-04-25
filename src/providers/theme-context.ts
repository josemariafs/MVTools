import { createContext } from 'react'

const THEMES = {
  DARK: 'dark',
  LIGHT: 'light',
  SYSTEM: 'system'
} as const

export type Theme = (typeof THEMES)[keyof typeof THEMES]

interface ThemeProviderState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: THEMES.SYSTEM,
  setTheme: () => null
}

export const ThemeContext = createContext<ThemeProviderState | null>(initialState)
