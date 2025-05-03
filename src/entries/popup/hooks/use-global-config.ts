import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

import { useMutate } from '@/hooks/use-mutate'
import { getGlobalConfig, setGlobalConfig } from '@/services/config'
import { BROWSER_STORAGE_KEYS } from '@/types/storage'

export const globalConfigQueryOptions = queryOptions({
  queryKey: [BROWSER_STORAGE_KEYS.GLOBAL_CONFIG],
  queryFn: getGlobalConfig,
  staleTime: Infinity
})

export const useGlobalConfig = () => useSuspenseQuery(globalConfigQueryOptions)
export const useMutateGlobalConfig = ({ toast = false }: { toast?: boolean } = {}) =>
  useMutate(globalConfigQueryOptions.queryKey, setGlobalConfig, toast)
