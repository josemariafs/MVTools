import { z } from 'zod'

import { noValueAbortEarly, userValidator } from '@/utils/zod'

export const ignoredUsersFormSchema = z.object({
  ignoredUser: z
    .string()
    .superRefine(noValueAbortEarly('Introduce un usuario'))
    .superRefine(
      userValidator({
        condition: (postsConfig, value) => postsConfig.ignoredUsers.map(user => user.toLowerCase()).includes(value.toLowerCase()),
        message: 'El usuario ya está en la lista de ignorados.'
      })
    )
})

export type IgnoredUsersFormData = z.infer<typeof ignoredUsersFormSchema>
