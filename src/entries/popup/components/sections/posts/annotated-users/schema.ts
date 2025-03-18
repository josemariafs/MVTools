import { z } from 'zod'

import type { PostsConfig } from '@/services/config'
import { checkUser } from '@/services/media-vida'
import { asyncValidator } from '@/utils/zod'

const commonSchema = z.string().trim()

export const getAnnotatedUsersSchema = (data: PostsConfig) =>
  z.object({
    username: commonSchema
      .toLowerCase()
      .nonempty('Introduce un nick de usuario')
      .refine(
        value => !data.userNotes.some(({ username }) => username.toLowerCase() === value),
        'El usuario ya está en la lista de anotados'
      )
      .superRefine(asyncValidator(checkUser)),
    note: commonSchema.nonempty('Introduce una nota')
  })
