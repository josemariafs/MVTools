import { z } from 'zod'

import { noValueAbortEarly, userValidator } from '@/utils/zod'

export const highlightedUsersFormSchema = z.object({
  highlightedUser: z
    .string()
    .superRefine(noValueAbortEarly('Introduce un usuario'))
    .superRefine(
      userValidator({
        condition: (postsConfig, value) => postsConfig.highlightedUsers.includes(value),
        message: 'El usuario ya está en la lista de destacados.'
      })
    )
})

export type HighlightedUsersFormData = z.infer<typeof highlightedUsersFormSchema>
