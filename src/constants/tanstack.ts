import { QueryCache, QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface MyMeta extends Record<string, unknown> {
  toast?: boolean
}

declare module '@tanstack/react-query' {
  interface Register {
    queryMeta: MyMeta
    mutationMeta: MyMeta
  }
}

export const defaultQueryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (!query.meta?.toast) return
      toast.error(error.message)
    }
  })
})
