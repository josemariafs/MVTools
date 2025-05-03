import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

import { useMutate } from '@/hooks/use-mutate'
import { getStylesConfig, setStylesConfig } from '@/services/config'
import { BROWSER_STORAGE_KEYS } from '@/types/storage'

export const stylesConfigQueryOptions = queryOptions({
  queryKey: [BROWSER_STORAGE_KEYS.STYLES_CONFIG],
  queryFn: getStylesConfig,
  staleTime: Infinity
})

export const useStylesConfig = () => useSuspenseQuery(stylesConfigQueryOptions)
export const useMutateStylesConfig = () => useMutate(stylesConfigQueryOptions.queryKey, setStylesConfig)
