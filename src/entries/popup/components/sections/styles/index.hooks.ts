import { useAppForm } from '@/entries/popup/hooks/use-form'
import { useMutateStylesConfig, useStylesConfig } from '@/entries/popup/hooks/use-styles-config'
import { stylesConfigSchema } from '@/services/config'

export const useStylesConfigForm = () => {
  const { mutate } = useMutateStylesConfig()
  const { data } = useStylesConfig()

  return useAppForm({
    defaultValues: data,
    validators: {
      onSubmit: stylesConfigSchema
    },
    onSubmit: ({ value }) => {
      mutate(value)
    }
  })
}
