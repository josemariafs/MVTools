import { z } from 'zod'

import { existUserValidator, noValueAbortEarly, postConfigConditionValidator } from '@/utils/zod'

export const ignoredUsersFormSchema = z.object({
  ignoredUser: z
    .string()
    .transform(noValueAbortEarly('Introduce un usuario'))
    .superRefine(
      postConfigConditionValidator({
        condition: (postConfig, value) => postConfig.ignoredUsers.some(user => user.toLowerCase() === value.toLowerCase()),
        message: 'El usuario ya está en la lista de ignorados.'
      })
    )
    .superRefine(existUserValidator())
})

export type IgnoredUsersFormData = z.infer<typeof ignoredUsersFormSchema>
