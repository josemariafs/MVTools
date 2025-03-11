import { zodResolver } from '@hookform/resolvers/zod'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'

import { STORAGE_KEYS } from '@/constants'
import { useMutate } from '@/entries/popup/hooks/use-mutate'
import { getStylesConfig, setStylesConfig, type StylesConfig, stylesConfigSchema } from '@/services/config'

export const stylesConfigQueryOptions = queryOptions({
  queryKey: [STORAGE_KEYS.STYLES_CONFIG],
  queryFn: getStylesConfig
})

export const useMutateStylesConfig = () => useMutate(stylesConfigQueryOptions.queryKey, setStylesConfig)
export const useStylesConfigForm = () => {
  const { data } = useSuspenseQuery(stylesConfigQueryOptions)

  return useForm<StylesConfig>({
    resolver: zodResolver(stylesConfigSchema),
    defaultValues: data
  })
}
