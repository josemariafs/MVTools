import { useAppForm } from '@/entries/popup/hooks/use-form'
import { useGlobalConfig, useMutateGlobalConfig } from '@/entries/popup/hooks/use-global-config'

export const useRawgForm = () => {
  const { mutatePartial } = useMutateGlobalConfig({ toast: true })
  const {
    data: { rawgApiKey }
  } = useGlobalConfig()

  return useAppForm({
    defaultValues: { rawgApiKey },
    onSubmit: ({ value: { rawgApiKey: key } }) => {
      mutatePartial({ rawgApiKey: key.trim() })
    }
  })
}
