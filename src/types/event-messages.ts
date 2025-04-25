import { z } from 'zod'

export const MESSAGE_TYPES = {
  MIGRATED_FROM_LOCAL_STORAGE: 'migratedFromLocalStorage',
  INJECT_DEAL_SCRIPT: 'injectDealScript'
} as const

export const DefaultEventListenerPayloadSchema = z.object({
  type: z.enum([MESSAGE_TYPES.MIGRATED_FROM_LOCAL_STORAGE, MESSAGE_TYPES.INJECT_DEAL_SCRIPT])
})

export const MigratedFromLocalStoragePayloadSchema = DefaultEventListenerPayloadSchema.extend({
  type: z.literal(MESSAGE_TYPES.MIGRATED_FROM_LOCAL_STORAGE),
  migrated: z.boolean()
})

export type MigratedFromLocalStoragePayload = z.infer<typeof MigratedFromLocalStoragePayloadSchema>

export const InjectDealScriptPayloadSchema = z.object({
  type: z.literal(MESSAGE_TYPES.INJECT_DEAL_SCRIPT),
  deal: z.object({
    title: z.string(),
    price: z.string(),
    link: z.string(),
    description: z.string(),
    dealImgUrl: z.string(),
    voucher: z.string().optional()
  })
})

export type InjectDealScriptPayload = z.infer<typeof InjectDealScriptPayloadSchema>
