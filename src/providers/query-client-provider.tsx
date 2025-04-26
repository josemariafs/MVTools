import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { ComponentProps, PropsWithChildren } from 'react'

import { defaultQueryClient } from '@/constants/tanstack'

export const DefaultQueryClientProvider = ({ children, ...rest }: PropsWithChildren<ComponentProps<typeof ReactQueryDevtools>>) => {
  return (
    <QueryClientProvider client={defaultQueryClient}>
      {children}
      <ReactQueryDevtools
        initialIsOpen={false}
        buttonPosition='top-left'
        {...rest}
      />
    </QueryClientProvider>
  )
}
