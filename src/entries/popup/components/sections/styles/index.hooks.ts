import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

import { STORAGE_KEYS } from '@/constants'
import { useMutate } from '@/entries/popup/hooks/use-mutate'
import { useAppForm } from '@/hooks/use-form'
import { getStylesConfig, setStylesConfig, stylesConfigSchema } from '@/services/config'

export const stylesConfigQueryOptions = queryOptions({
  queryKey: [STORAGE_KEYS.STYLES_CONFIG],
  queryFn: getStylesConfig
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
