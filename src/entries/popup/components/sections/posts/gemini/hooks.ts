import { useAppForm } from '@/components/ui/form'
import { geminiFormSchema } from '@/entries/popup/components/sections/posts/gemini/schema'
import { useMutatePostsConfig, usePostsConfig } from '@/entries/popup/components/sections/posts/hooks'

export const useGeminiForm = () => {
  const { mutatePartial } = useMutatePostsConfig({ toast: true })
  const {
    data: { geminiApiKey }
  } = usePostsConfig()

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
