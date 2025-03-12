import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { type GeminiFormData, geminiFormSchema } from '@/entries/popup/components/sections/posts/gemini/schema'
import { usePostsConfig } from '@/entries/popup/components/sections/posts/hooks'

export const useGeminiForm = () => {
  const {
    data: { geminiApiKey }
  } = usePostsConfig()

  return useForm<GeminiFormData>({
    resolver: zodResolver(geminiFormSchema),
    reValidateMode: 'onSubmit',
    defaultValues: {
      geminiApiKey
    }
  })
}
