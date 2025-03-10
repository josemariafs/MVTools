import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

import { STORAGE_KEYS } from '@/constants'
import { useMutate } from '@/entries/popup/hooks/use-mutate'
import {
  getIsPremiumBackgroundDisabled,
  getIsPremiumEnabled,
  getIsUltraWideEnabled,
  setPremiumBackgroundDisabled,
  setPremiumEnabled,
  setUltraWideEnabled
} from '@/services/config'

export const premiumEnabledQueryOptions = queryOptions({
  queryKey: [STORAGE_KEYS.MV_PREMIUM_ENABLED],
  queryFn: getIsPremiumEnabled
})

export const backgroundDisabledQueryOptions = queryOptions({
  queryKey: [STORAGE_KEYS.MV_PREMIUM_BG_DISABLED],
  queryFn: getIsPremiumBackgroundDisabled
})

export const ultraWideEnabledQueryOptions = queryOptions({
  queryKey: [STORAGE_KEYS.MV_ULTRA_WIDE_ENABLED],
  queryFn: getIsUltraWideEnabled
})

export const useIsPremiumEnabled = () => useSuspenseQuery(premiumEnabledQueryOptions)
export const useIsBackgroundDisabled = () => useSuspenseQuery(backgroundDisabledQueryOptions)
export const useIsUltraWideEnabled = () => useSuspenseQuery(ultraWideEnabledQueryOptions)

export const useMutateIsPremiumEnabled = () => useMutate(premiumEnabledQueryOptions.queryKey, setPremiumEnabled)
export const useMutateIsBackgroundDisabled = () => useMutate(backgroundDisabledQueryOptions.queryKey, setPremiumBackgroundDisabled)
export const useMutateIsUltraWideEnabled = () => useMutate(ultraWideEnabledQueryOptions.queryKey, setUltraWideEnabled)
