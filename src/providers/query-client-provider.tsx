import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { PropsWithChildren } from 'react'

import { defaultQueryClient } from '@/constants/tanstack'

export const DefaultQueryClientProvider = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={defaultQueryClient}>
      {children}
      <ReactQueryDevtools
        initialIsOpen={false}
        buttonPosition='top-left'
      />
    </QueryClientProvider>
  )
}
