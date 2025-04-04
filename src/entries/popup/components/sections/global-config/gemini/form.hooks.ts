import { geminiFormSchema } from '@/entries/popup/components/sections/global-config/gemini/schema'
import { useGlobalConfig, useMutateGlobalConfig } from '@/entries/popup/hooks/use-global-config'
import { useAppForm } from '@/hooks/use-form'

export const useGeminiForm = () => {
  const { mutatePartial } = useMutateGlobalConfig({ toast: true })
  const {
    data: { geminiApiKey }
  } = useGlobalConfig()

  return useAppForm({
    defaultValues: {
      geminiApiKey
    },
    validators: {
      onSubmitAsync: geminiFormSchema
    },
    onSubmit: ({ value }) => {
      mutatePartial(value)
    }
  })
}
