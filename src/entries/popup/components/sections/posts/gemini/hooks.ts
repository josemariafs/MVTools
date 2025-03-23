import { geminiFormSchema } from '@/entries/popup/components/sections/posts/gemini/schema'
import { useGlobalConfig, useMutateGlobalConfig } from '@/entries/popup/components/sections/posts/hooks'
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
