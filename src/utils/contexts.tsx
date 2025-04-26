import { type Context, type PropsWithChildren, useContext, useMemo } from 'react'

export const createContextProvider =
  <T,>(Context: Context<T>) =>
  // eslint-disable-next-line react/display-name -- We need to create a custom context provider
  ({ children, ...rest }: PropsWithChildren<T>) => {
    const data = useMemo(() => ({ ...rest }), [rest])
    return <Context value={data as T}>{children}</Context>
  }

export const createUseContext =
  <T,>(context: Context<T>) =>
  () => {
    const data = useContext(context)

    if (data == null) {
      // throw new Error('useShadowRoot must be used within a ShadowRootProvider')
      throw new Error(`use${context.displayName} must be used within a ${context.displayName}Provider`)
    }

    return { ...data }
  }
