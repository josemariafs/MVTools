import { z } from 'zod'

import type { PostsConfig } from '@/services/config'
import { checkUser } from '@/services/media-vida'
import { asyncValidator } from '@/utils/zod'

export const getIgnoredUsersSchema = (data: PostsConfig) =>
  z.object({
    ignoredUser: z
      .string()
      .trim()
      .toLowerCase()
      .nonempty('Introduce un nick de usuario')
      .refine(
        value => !data.userNotes.some(({ username }) => username.toLowerCase() === value),
        'El usuario ya está en la lista de ignorados'
      )
      .superRefine(asyncValidator(checkUser))
  })
