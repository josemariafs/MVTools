import AwesomeDebouncePromise from 'awesome-debounce-promise'
import { z } from 'zod'

import { userValidator } from '@/services/media-vida'

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
