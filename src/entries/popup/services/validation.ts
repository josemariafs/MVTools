import { z } from 'zod'

import type { GlobalConfig } from '@/services/config'
import { checkApiKey } from '@/services/gemini'
import { checkUser } from '@/services/media-vida'
import { asyncValidator } from '@/utils/zod'

const commonSchema = z.string().trim()
const commonUsernameSchema = commonSchema.toLowerCase().nonempty('Introduce un nick de usuario')
export const geminiFormSchema = z.string().superRefine(asyncValidator(checkApiKey, true))
export const checkUserSchema = commonSchema.superRefine(asyncValidator(checkUser))
export const noteSchema = commonSchema.nonempty('Introduce una nota').max(100, 'La nota debe tener como máximo 100 caracteres')
export const getUsernameSchema = (data: GlobalConfig, field: StringArrayFieldKeys | ObjectArrayFieldKeys) => {
  const errorMessages: Record<ObjectArrayFieldKeys | StringArrayFieldKeys, string> = {
    userNotes: 'anotados',
    highlightedUsers: 'destacados',
    ignoredUsers: 'ignorados'
  } as const
  return getUserInListSchema({ data, field, errorMessage: errorMessages[field] })
}

type StringArrayFieldKeys = {
  [K in keyof GlobalConfig]: GlobalConfig[K] extends readonly string[] ? K : never
}[keyof GlobalConfig]

type ObjectArrayFieldKeys = {
  [K in keyof GlobalConfig]: GlobalConfig[K] extends ReadonlyArray<infer Item> ? (Item extends string ? never : K) : never
}[keyof GlobalConfig]

function getUserInListSchema({
  data,
  field,
  errorMessage
}: {
  data: GlobalConfig
  field: StringArrayFieldKeys | ObjectArrayFieldKeys
  errorMessage: string
}) {
  return commonUsernameSchema.refine(
    value =>
      !data[field].some(item => {
        const itemUsername = typeof item === 'string' ? item : item.username
        return itemUsername.toLowerCase() === value
      }),
    `El usuario ya está en la lista de ${errorMessage}`
  )
}
