import { z } from 'zod'

import { filterNotNotified, getGamesReleasingOnDay, getLocalYmd, type NotifiedByYmd } from '@/services/rawg-helpers'
import { getLocalStoredProperty, setLocalStoredProperty } from '@/services/storage'
import { type RawgGameListItem, type RawgUpcomingCache, rawgUpcomingCacheSchema } from '@/types/rawg'
import { BROWSER_STORAGE_KEYS } from '@/types/storage'

const notifiedByYmdSchema = z.record(z.string(), z.array(z.number()))

export async function getRawgUpcomingFromStorage(): Promise<RawgUpcomingCache | null> {
  const raw = await getLocalStoredProperty<unknown>(BROWSER_STORAGE_KEYS.RAWG_UPCOMING_CACHE, null)
  if (raw === null) return null
  const p = rawgUpcomingCacheSchema.safeParse(raw)
  return p.success ? p.data : null
}

async function getNotifiedByYmd(): Promise<NotifiedByYmd> {
  const raw = await getLocalStoredProperty<unknown>(BROWSER_STORAGE_KEYS.RELEASE_DAY_NOTIFIED_BY_YMD, {})
  const p = notifiedByYmdSchema.safeParse(raw)
  return p.success ? p.data : {}
}

export async function markGamesNotifiedForDay(dayYmd: string, gameIds: number[]): Promise<void> {
  const current = await getNotifiedByYmd()
  const prev = current[dayYmd] ?? []
  const set = new Set([...prev, ...gameIds])
  await setLocalStoredProperty(BROWSER_STORAGE_KEYS.RELEASE_DAY_NOTIFIED_BY_YMD, { ...current, [dayYmd]: [...set] })
}

export async function getUnnotifiedGamesReleasingToday(): Promise<{
  todayYmd: string
  cache: RawgUpcomingCache | null
  toNotify: RawgGameListItem[]
  allToday: RawgGameListItem[]
  notified: NotifiedByYmd
}> {
  const todayYmd = getLocalYmd()
  const cache = await getRawgUpcomingFromStorage()
  if (!cache) {
    return { todayYmd, cache: null, toNotify: [], allToday: [], notified: await getNotifiedByYmd() }
  }
  const allToday = getGamesReleasingOnDay(cache, todayYmd)
  const notified = await getNotifiedByYmd()
  const toNotify = filterNotNotified(todayYmd, allToday, notified)
  return { todayYmd, cache, toNotify, allToday, notified }
}
