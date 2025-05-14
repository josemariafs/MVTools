import type { Model } from '@google/genai'
import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query'

import { getModels } from '@/services/gemini'

const geminiModelsQueryOptions = <T>(apiKey: string) =>
  queryOptions<Model[], Error, T>({
    queryKey: ['geminiModels', apiKey],
    queryFn: async () => {
      const models = await getModels(apiKey)
      return models
        .filter(model => model.supportedActions?.includes('generateContent'))
        .map(model => ({
          ...model,
          name: model.name?.replace('models/', '')
        }))
    },
    enabled: !!apiKey,
    staleTime: Infinity,
    placeholderData: keepPreviousData,
    meta: { toast: true }
  })

type GeminiModelsQueryOptions<T> = Partial<ReturnType<typeof geminiModelsQueryOptions<T>>>

export const useGeminiModels = <T = Model[]>(apiKey: string, options?: GeminiModelsQueryOptions<T>) =>
  useQuery({ ...geminiModelsQueryOptions<T>(apiKey), ...options })
