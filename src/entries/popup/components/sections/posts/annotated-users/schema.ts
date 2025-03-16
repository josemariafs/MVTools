import { z } from 'zod'

import { existUserValidator, noValueAbortEarly, postConfigConditionValidator } from '@/utils/zod'

export const annotatedUsersFormSchema = z
  .object({
    username: z
      .string()
      .transform(noValueAbortEarly('Introduce un usuario'))
      .superRefine(
        postConfigConditionValidator({
          condition: (postConfig, value) => postConfig.userNotes.some(({ username }) => username.toLowerCase() === value.toLowerCase()),
          message: 'El usuario ya está en la lista de anotados'
        })
      ),
    note: z.string().transform(noValueAbortEarly('Introduce una nota'))
  })
  .superRefine(existUserValidator({ userKey: 'username', formField: 'username' }))

export type AnnotatedUsersFormData = z.infer<typeof annotatedUsersFormSchema>
