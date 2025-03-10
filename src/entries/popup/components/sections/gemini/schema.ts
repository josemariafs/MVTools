import { type RefinementCtx, z } from 'zod'

import { testApiKey } from '@/services/gemini'

const validApiKeyTransform = async (value: string, ctx: RefinementCtx) => {
  if (!value) return value

  const validation = await testApiKey(value)
  if (!validation.ok) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: validation.status === 400 ? 'La API Key no es válida' : 'No se ha podido validar la API Key. Por favor, inténtalo de nuevo.'
    })
    return z.NEVER
  }
  return value
}

export const formSchema = z.object({
  apiKey: z.string().transform(validApiKeyTransform)
})

export type FormData = z.infer<typeof formSchema>
