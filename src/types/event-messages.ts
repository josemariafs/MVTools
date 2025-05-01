import { z } from 'zod'

export const MESSAGE_TYPES = {
  MIGRATED_FROM_LOCAL_STORAGE: 'migratedFromLocalStorage',
  DEAL: 'deal'
} as const

export const DefaultEventListenerPayloadSchema = z.object({
  type: z.enum([MESSAGE_TYPES.MIGRATED_FROM_LOCAL_STORAGE])
})

export const MigratedFromLocalStoragePayloadSchema = DefaultEventListenerPayloadSchema.extend({
  type: z.literal(MESSAGE_TYPES.MIGRATED_FROM_LOCAL_STORAGE),
  migrated: z.boolean()
})

export type MigratedFromLocalStoragePayload = z.infer<typeof MigratedFromLocalStoragePayloadSchema>

export interface Deal {
  title: string
  price: string
  link: string
  description: string
  dealImgUrl: string
  voucher?: string
}

export const DealPayloadSchema = z.object({
  type: z.literal(MESSAGE_TYPES.DEAL)
})

export type DealPayload = z.infer<typeof DealPayloadSchema>
