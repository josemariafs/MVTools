import { QueryClientProvider } from '@tanstack/react-query'
import { type ComponentProps, type ComponentType, lazy, type PropsWithChildren, Suspense } from 'react'

import { defaultQueryClient } from '@/constants/tanstack'

type RQDevtoolsProps = ComponentProps<(typeof import('@tanstack/react-query-devtools'))['ReactQueryDevtools']>

const ReactQueryDevtoolsLazy = lazy(() =>
  import('@tanstack/react-query-devtools').then(m => ({ default: m.ReactQueryDevtools as ComponentType<RQDevtoolsProps> }))
)

const devtoolsDefaultProps: Pick<RQDevtoolsProps, 'initialIsOpen' | 'buttonPosition'> = {
  initialIsOpen: false,
  buttonPosition: 'top-left'
}

function MaybeReactQueryDevtools(props: Partial<RQDevtoolsProps>) {
  if (!import.meta.env.DEV) {
    return null
  }
  return (
    <Suspense fallback={null}>
      <ReactQueryDevtoolsLazy
        {...devtoolsDefaultProps}
        {...props}
      />
    </Suspense>
  )
}

export const DefaultQueryClientProvider = ({ children, ...rest }: PropsWithChildren<Partial<RQDevtoolsProps>>) => {
  return (
    <QueryClientProvider client={defaultQueryClient}>
      {children}
      <MaybeReactQueryDevtools {...rest} />
    </QueryClientProvider>
  )
}
