import { useAppForm } from '@/entries/popup/hooks/use-form'
import { useGlobalConfig, useMutateGlobalConfig } from '@/entries/popup/hooks/use-global-config'

export const useGeminiForm = () => {
  const { mutatePartial } = useMutateGlobalConfig({ toast: true })
  const {
    data: { geminiApiKey }
  } = useGlobalConfig()

  return useAppForm({
    defaultValues: {
      geminiApiKey
    },
    onSubmit: ({ value: { geminiApiKey } }) => {
      mutatePartial({ geminiApiKey: geminiApiKey.trim() })
    }
  })
}
