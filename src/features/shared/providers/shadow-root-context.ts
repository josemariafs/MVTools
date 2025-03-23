import { createContext } from 'react'

interface ShadowRootData {
  appRoot: HTMLElement
}

export const ShadowRootContext = createContext<ShadowRootData | null>(null)
