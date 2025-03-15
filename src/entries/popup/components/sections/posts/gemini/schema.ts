import { z } from 'zod'

import { apiKeyValidator } from '@/utils/zod'

export const geminiFormSchema = z.object({
  geminiApiKey: z.string().superRefine(apiKeyValidator)
})

export type GeminiFormData = z.infer<typeof geminiFormSchema>
