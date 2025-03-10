import { zodResolver } from '@hookform/resolvers/zod'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'

import { STORAGE_KEYS } from '@/constants'
import { type FormData, formSchema } from '@/entries/popup/components/sections/gemini/schema'
import { useMutate } from '@/entries/popup/hooks/use-mutate'
import { getGeminiApiKey, setGeminiApiKey } from '@/services/config'

export const geminiApiKeyQueryOptions = queryOptions({
  queryKey: [STORAGE_KEYS.GEMINI_APY_KEY],
  queryFn: getGeminiApiKey
})

export const useMutateGeminiApiKey = () => useMutate(geminiApiKeyQueryOptions.queryKey, setGeminiApiKey, true)
export const useGeminiForm = () => {
  const { data: apiKey } = useSuspenseQuery(geminiApiKeyQueryOptions)

  return useForm<FormData>({
    resolver: zodResolver(formSchema),
    reValidateMode: 'onSubmit',
    defaultValues: {
      apiKey
    }
  })
}
