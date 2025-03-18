import { useAppForm } from '@/components/ui/form'
import { geminiFormSchema } from '@/entries/popup/components/sections/posts/gemini/schema'
import { useGlobalConfig, useMutateGlobalConfig } from '@/entries/popup/components/sections/posts/hooks'

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
