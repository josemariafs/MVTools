import { z } from 'zod'

import { noValueAbortEarly, userValidator } from '@/utils/zod'

export const annotatedUsersFormSchema = z
  .object({
    username: z.string().superRefine(noValueAbortEarly('Introduce un usuario')),
    note: z.string().superRefine(noValueAbortEarly('Introduce una nota'))
  })
  .superRefine(
    userValidator({
      condition: (postsConfig, value) =>
        postsConfig.userNotes.some(({ username }) => username.toLowerCase() === value.username.toLowerCase()),
      userName: value => value.username,
      path: 'username',
      message: 'El usuario ya está en la lista de anotados.'
    })
  )

export type AnnotatedUsersFormData = z.infer<typeof annotatedUsersFormSchema>
