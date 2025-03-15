import AwesomeDebouncePromise from 'awesome-debounce-promise'
import { z } from 'zod'

import { userValidator } from '@/services/media-vida'

export const highlightedUsersFormSchema = z.object({
  highlightedUser: z
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

export type HighlightedUsersFormData = z.infer<typeof highlightedUsersFormSchema>
