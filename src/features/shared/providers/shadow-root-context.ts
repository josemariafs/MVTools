import { createContext } from 'react'

interface ShadowRootData {
  appRoot: HTMLElement
  cssPaths: string[]
}

export const ShadowRootContext = createContext<ShadowRootData | null>(null)
