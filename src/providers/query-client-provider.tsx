import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export const defaultQueryClient = new QueryClient()

export const DefaultQueryClientProvider = ({ children }: Props) => {
  return (
    <QueryClientProvider client={defaultQueryClient}>
      {children}
      <ReactQueryDevtools
        initialIsOpen={false}
        buttonPosition='top-right'
      />
    </QueryClientProvider>
  )
}
