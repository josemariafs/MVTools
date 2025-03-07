import { z } from 'zod'

export const FORM_FIELDS = {
  USERNAME: 'username'
} as const

export const formSchema = z.object({
  username: z.string().min(2).max(50)
})

export type FormData = z.infer<typeof formSchema>
