import AwesomeDebouncePromise from 'awesome-debounce-promise'
import { type RefinementCtx, z } from 'zod'

import { getPostsConfig } from '@/services/config'
import { checkApiKey } from '@/services/gemini'
import { checkUser } from '@/services/media-vida'

export const noValueAbortEarly = (message: string) => {
  return (value: string, ctx: RefinementCtx) => {
    if (!value) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
        fatal: true
      })

      return z.NEVER
    }
  }
}

export const apiKeyValidator = async (value: string, ctx: RefinementCtx) => {
  if (!value) return value

  try {
    await checkApiKey(value)
  } catch (error) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: (error as Error).message
    })
  }
}

interface CommonValidatorProps<T> {
  condition: (postConfig: Awaited<ReturnType<typeof getPostsConfig>>, value: T) => boolean
  message: string
  debounce?: number
}

type ObjectValidatorProps<T extends object> = CommonValidatorProps<T> & {
  userName: (value: T) => string
  path: keyof T
}

type StringValidatorProps<T> = CommonValidatorProps<T> & {
  userName?: (value: T) => string
  path?: never
}

export const userValidator = <T>({
  condition,
  message,
  userName,
  path,
  debounce = 500
}: T extends object ? ObjectValidatorProps<T> : T extends string ? StringValidatorProps<T> : never) => {
  return AwesomeDebouncePromise(async (value: T, ctx: RefinementCtx) => {
    try {
      const postsConfig = await getPostsConfig()
      if (condition(postsConfig, value)) {
        throw new Error(message)
      }
      await checkUser(userName?.(value) ?? String(value))
    } catch (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: path != null ? [String(path)] : undefined,
        message: (error as Error).message
      })
    }
  }, debounce)
}
