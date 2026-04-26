import { z } from 'zod'

import { getLocalStoredProperty, removeLocalStoredKey, setLocalStoredProperty } from '@/services/storage'
import { BROWSER_STORAGE_KEYS } from '@/types/storage'

export const PENDING_JUEGOS_TTL_MS = 15 * 60 * 1000

const pendingJuegosThreadSchema = z.object({
  v: z.literal(1),
  rawgGameId: z.number().int().positive(),
  createdAt: z.number()
})

export type PendingJuegosThread = z.infer<typeof pendingJuegosThreadSchema>

export async function getPendingJuegosThread(): Promise<PendingJuegosThread | null> {
  const raw = await getLocalStoredProperty<unknown>(BROWSER_STORAGE_KEYS.PENDING_JUEGOS_THREAD, null)
  if (raw === null) return null
  const p = pendingJuegosThreadSchema.safeParse(raw)
  if (!p.success) return null
  if (Date.now() - p.data.createdAt > PENDING_JUEGOS_TTL_MS) {
    await clearPendingJuegosThread()
    return null
  }
  return p.data
}

export async function setPendingJuegosThreadForGameId(rawgGameId: number): Promise<void> {
  const v: PendingJuegosThread = { v: 1, rawgGameId, createdAt: Date.now() }
  await setLocalStoredProperty(BROWSER_STORAGE_KEYS.PENDING_JUEGOS_THREAD, v)
}

export async function clearPendingJuegosThread(): Promise<void> {
  await removeLocalStoredKey(BROWSER_STORAGE_KEYS.PENDING_JUEGOS_THREAD)
}
