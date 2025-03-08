import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

import { STORAGE_KEYS } from '@/constants'
import { useMutate } from '@/entries/popup/hooks/use-mutate'
import { getConfigService } from '@/services/config-service'

const ConfigService = getConfigService()

export const premiumEnabledQueryOptions = queryOptions({
  queryKey: [STORAGE_KEYS.MV_PREMIUM_ENABLED],
  queryFn: ConfigService.getIsPremiumEnabled
})

export const backgroundDisabledQueryOptions = queryOptions({
  queryKey: [STORAGE_KEYS.MV_PREMIUM_BG_DISABLED],
  queryFn: ConfigService.getIsPremiumBackgroundDisabled
})

export const ultraWideEnabledQueryOptions = queryOptions({
  queryKey: [STORAGE_KEYS.MV_ULTRA_WIDE_ENABLED],
  queryFn: ConfigService.getIsUltraWideEnabled
})

export const useIsPremiumEnabled = () => useSuspenseQuery(premiumEnabledQueryOptions)
export const useIsBackgroundDisabled = () => useSuspenseQuery(backgroundDisabledQueryOptions)
export const useIsUltraWideEnabled = () => useSuspenseQuery(ultraWideEnabledQueryOptions)

export const useMutateIsPremiumEnabled = () => useMutate(premiumEnabledQueryOptions.queryKey, ConfigService.setPremiumEnabled)
export const useMutateIsBackgroundDisabled = () =>
  useMutate(backgroundDisabledQueryOptions.queryKey, ConfigService.setPremiumBackgroundDisabled)
export const useMutateIsUltraWideEnabled = () => useMutate(ultraWideEnabledQueryOptions.queryKey, ConfigService.setUltraWideEnabled)
