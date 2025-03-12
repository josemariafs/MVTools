import { z } from 'zod'

import { validApiKeyTransform } from '@/services/gemini'

export const geminiFormSchema = z.object({
  geminiApiKey: z.string().superRefine(validApiKeyTransform)
})

export type GeminiFormData = z.infer<typeof geminiFormSchema>
