import { z } from 'zod'

import { postsConfigSchema } from '@/services/config'
import { validApiKeyTransform } from '@/services/gemini'

export const geminiFormSchema = postsConfigSchema.pick({ geminiApiKey: true }).extend({
  geminiApiKey: z.string().superRefine(validApiKeyTransform)
})

export type GeminiFormData = z.infer<typeof geminiFormSchema>
