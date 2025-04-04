import { z } from 'zod'

import { checkApiKey } from '@/services/gemini'
import { asyncValidator } from '@/utils/zod'

export const geminiFormSchema = z.object({
  geminiApiKey: z.string().superRefine(asyncValidator(checkApiKey, true))
})
