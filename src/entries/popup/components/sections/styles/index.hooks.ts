import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

import { useAppForm } from '@/entries/popup/hooks/use-form'
import { useMutate } from '@/entries/popup/hooks/use-mutate'
import { BROWSER_STORAGE_KEYS, getStylesConfig, setStylesConfig, stylesConfigSchema } from '@/services/config'

export const stylesConfigQueryOptions = queryOptions({
  queryKey: [BROWSER_STORAGE_KEYS.STYLES_CONFIG],
  queryFn: getStylesConfig,
  staleTime: Infinity
})

const useMutateStylesConfig = () => useMutate(stylesConfigQueryOptions.queryKey, setStylesConfig)
export const useStylesConfigForm = () => {
  const { mutate } = useMutateStylesConfig()
  const { data } = useSuspenseQuery(stylesConfigQueryOptions)

  return useAppForm({
    defaultValues: data,
    validators: {
      onSubmit: stylesConfigSchema
    },
    onSubmit: ({ value: { premiumBgDisabled, premiumEnabled, ...rest }, formApi }) => {
      mutate({
        ...rest,
        premiumEnabled,
        premiumBgDisabled: !premiumEnabled ? false : premiumBgDisabled
      })

      if (!premiumEnabled) {
        formApi.setFieldValue('premiumBgDisabled', false)
      }
    }
  })
}
