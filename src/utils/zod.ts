import AwesomeDebouncePromise from 'awesome-debounce-promise'
import { type RefinementCtx, z } from 'zod'

import { getPostsConfig } from '@/services/config'
import { checkApiKey } from '@/services/gemini'
import { checkUser } from '@/services/media-vida'

export const noValueAbortEarly = (message: string) => {
  return (value: string, ctx: RefinementCtx) => {
    if (!value.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
        fatal: true
      })

      return z.NEVER
    }

    return value.trim()
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

type StringKeys<T> = Extract<keyof T, string>

interface ObjectUserKey<T extends object> {
  userKey: StringKeys<T>
}

interface StringUserKey {
  userKey?: never
}

interface CommonIsDuplicatedValidatorProps<T> {
  condition: (postConfig: Awaited<ReturnType<typeof getPostsConfig>>, value: T) => boolean
  message: string
}

export const postConfigConditionValidator = <T>({ condition, message }: CommonIsDuplicatedValidatorProps<T>) => {
  return async (value: T, ctx: RefinementCtx) => {
    const postsConfig = await getPostsConfig()
    if (condition(postsConfig, value)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        fatal: true,
        message
      })
      return z.NEVER
    }
  }
}

interface CommonExistsUserValidatorProps {
  debounce?: number
  formField?: string
}

export const existUserValidator = <T>(
  props?: T extends object ? ObjectUserKey<T> & CommonExistsUserValidatorProps : StringUserKey & CommonExistsUserValidatorProps
) => {
  const { userKey, formField, debounce = 500 } = props ?? {}

  return AwesomeDebouncePromise(async (value: T, ctx: RefinementCtx) => {
    try {
      const username = userKey ? String(value[userKey]) : String(value)
      await checkUser(username)
    } catch (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: formField ? [formField] : undefined,
        message: (error as Error).message
      })
    }
  }, debounce)
}
