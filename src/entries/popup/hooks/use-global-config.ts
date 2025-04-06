import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

import { useMutate } from '@/entries/popup/hooks/use-mutate'
import { BROWSER_STORAGE_KEYS, getGlobalConfig, setGlobalConfig } from '@/services/config'

export const globalConfigQueryOptions = queryOptions({
  queryKey: [BROWSER_STORAGE_KEYS.GLOBAL_CONFIG],
  queryFn: getGlobalConfig
})

export const useGlobalConfig = () => useSuspenseQuery(globalConfigQueryOptions)
export const useMutateGlobalConfig = ({ toast = false }: { toast?: boolean } = {}) =>
  useMutate(globalConfigQueryOptions.queryKey, setGlobalConfig, toast)
