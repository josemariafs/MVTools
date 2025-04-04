import { z } from 'zod'

import type { GlobalConfig } from '@/services/config'
import { checkUser } from '@/services/media-vida'
import { asyncValidator } from '@/utils/zod'

export const getHighlightedUsersSchema = (data: GlobalConfig) =>
  z.object({
    highlightedUser: z
      .string()
      .trim()
      .toLowerCase()
      .nonempty('Introduce un nick de usuario')
      .refine(
        value => !data.highlightedUsers.some(username => username.toLowerCase() === value),
        'El usuario ya está en la lista de anotados'
      )
      .superRefine(asyncValidator(checkUser))
  })
