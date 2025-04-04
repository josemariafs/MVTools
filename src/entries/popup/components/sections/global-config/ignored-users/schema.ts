import { z } from 'zod'

import type { GlobalConfig } from '@/services/config'
import { checkUser } from '@/services/media-vida'
import { asyncValidator } from '@/utils/zod'

export const getIgnoredUsersSchema = (data: GlobalConfig) =>
  z.object({
    ignoredUser: z
      .string()
      .trim()
      .toLowerCase()
      .nonempty('Introduce un nick de usuario')
      .refine(value => !data.ignoredUsers.some(username => username.toLowerCase() === value), 'El usuario ya está en la lista de ignorados')
      .superRefine(asyncValidator(checkUser))
  })
