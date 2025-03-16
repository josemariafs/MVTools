import { z } from 'zod'

import { existUserValidator, noValueAbortEarly, postConfigConditionValidator } from '@/utils/zod'

export const highlightedUsersFormSchema = z.object({
  highlightedUser: z
    .string()
    .transform(noValueAbortEarly('Introduce un usuario'))
    .superRefine(
      postConfigConditionValidator({
        condition: (postConfig, value) => postConfig.highlightedUsers.some(user => user.toLowerCase() === value.toLowerCase()),
        message: 'El usuario ya está en la lista de destacados.'
      })
    )
    .superRefine(existUserValidator())
})

export type HighlightedUsersFormData = z.infer<typeof highlightedUsersFormSchema>
