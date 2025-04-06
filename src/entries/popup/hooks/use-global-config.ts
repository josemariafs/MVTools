import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

import { useMutate } from '@/entries/popup/hooks/use-mutate'
import { getGlobalConfig, setGlobalConfig } from '@/services/config'
import { STORAGE_KEYS } from '@/types/storage'

export const globalConfigQueryOptions = queryOptions({
  queryKey: [STORAGE_KEYS.GLOBAL_CONFIG],
  queryFn: getGlobalConfig
})

export const useGlobalConfig = () => useSuspenseQuery(globalConfigQueryOptions)
export const useMutateGlobalConfig = ({ toast = false }: { toast?: boolean } = {}) =>
  useMutate(globalConfigQueryOptions.queryKey, setGlobalConfig, toast)
