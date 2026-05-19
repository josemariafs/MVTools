import { useAppForm } from '@/entries/popup/hooks/use-form'
import { useGlobalConfig, useMutateGlobalConfig } from '@/entries/popup/hooks/use-global-config'

export const useImgbbForm = () => {
  const { mutatePartial } = useMutateGlobalConfig({ toast: true })
  const {
    data: { imgbbApiKey }
  } = useGlobalConfig()

  return useAppForm({
    defaultValues: { imgbbApiKey },
    onSubmit: ({ value: { imgbbApiKey: key } }) => {
      mutatePartial({ imgbbApiKey: key.trim() })
    }
  })
}
