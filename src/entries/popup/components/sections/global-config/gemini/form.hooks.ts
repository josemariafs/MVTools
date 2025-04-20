import { geminiFormSchema } from '@/entries/popup/components/sections/global-config/gemini/schema'
import { useAppForm } from '@/entries/popup/hooks/use-form'
import { useGlobalConfig, useMutateGlobalConfig } from '@/entries/popup/hooks/use-global-config'
import { checkSchemaOnSubmitAsync } from '@/utils/zod'

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
      onSubmitAsync: checkSchemaOnSubmitAsync(geminiFormSchema)
    },
    onSubmit: ({ value: { geminiApiKey } }) => {
      mutatePartial({ geminiApiKey: geminiApiKey.trim() })
    }
  })
}
