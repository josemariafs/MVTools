import { z } from 'zod'

import type { GlobalConfig } from '@/services/config'
import { checkUser } from '@/services/media-vida'
import { asyncValidator } from '@/utils/zod'

const commonSchema = z.string().trim()

export const noteSchema = commonSchema.nonempty('Introduce una nota').max(100, 'La nota debe tener como máximo 100 caracteres')

export const getAnnotatedUsersSchema = (data: GlobalConfig) =>
  z.object({
    username: commonSchema
      .toLowerCase()
      .nonempty('Introduce un nick de usuario')
      .refine(
        value => !data.userNotes.some(({ username }) => username.toLowerCase() === value),
        'El usuario ya está en la lista de anotados'
      )
      .superRefine(asyncValidator(checkUser)),
    note: noteSchema
  })
