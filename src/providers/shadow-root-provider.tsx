import { createContext, type PropsWithChildren, useContext, useMemo } from 'react'

interface ShadowRootData {
  appRoot: HTMLElement
}

const ShadowRootContext = createContext<ShadowRootData | null>(null)

export const ShadowRootContextProvider = ({ children, ...rest }: PropsWithChildren<ShadowRootData>) => {
  const config = useMemo(() => ({ ...rest }), [rest])
  return <ShadowRootContext.Provider value={config}>{children}</ShadowRootContext.Provider>
}
export const useShadowRootContext = () => {
  const context = useContext(ShadowRootContext)

  if (context == null) {
    throw new Error('useShadowRootContext must be used within a ShadowRootContextProvider')
  }

  return { ...context }
}
