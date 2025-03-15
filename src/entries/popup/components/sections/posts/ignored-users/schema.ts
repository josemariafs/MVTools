import AwesomeDebouncePromise from 'awesome-debounce-promise'
import { type RefinementCtx, z } from 'zod'

import { getPostsConfig } from '@/services/config'
import { checkUser } from '@/services/media-vida'

const userValidator = async (value: string, ctx: RefinementCtx) => {
  try {
    const postsConfig = await getPostsConfig()
    if (postsConfig.ignoredUsers.includes(value)) {
      throw new Error('El usuario ya está en la lista de ignorados.')
    }
    await checkUser(value)
  } catch (error) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: (error as Error).message
    })
  }
}

export const ignoredUsersFormSchema = z.object({
  ignoredUser: z
    .string()
    .superRefine((value, ctx) => {
      if (!value) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Introduce un usuario',
          fatal: true
        })

        return z.NEVER
      }
    })
    .superRefine(AwesomeDebouncePromise(userValidator, 500))
})

export type IgnoredUsersFormData = z.infer<typeof ignoredUsersFormSchema>
