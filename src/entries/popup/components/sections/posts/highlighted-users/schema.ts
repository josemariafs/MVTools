import { z } from 'zod'

import { noValueAbortEarly, userValidator } from '@/utils/zod'

export const highlightedUsersFormSchema = z.object({
  highlightedUser: z
    .string()
    .transform(noValueAbortEarly('Introduce un usuario'))
    .superRefine(
      userValidator({
        condition: (postsConfig, value) => postsConfig.highlightedUsers.map(user => user.toLowerCase()).includes(value.toLowerCase()),
        message: 'El usuario ya está en la lista de destacados.'
      })
    )
})

export type HighlightedUsersFormData = z.infer<typeof highlightedUsersFormSchema>
