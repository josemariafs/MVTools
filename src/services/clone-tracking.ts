import { getGlobalConfig, setGlobalConfig, type GlobalConfig } from '@/services/config'
import {
  clonesPageUrl,
  parseClonesPageMeta,
  parseNonBannedBustedRows,
  type NonBannedBustedRow,
  type TrackedCloneAccount
} from '@/services/clone-tracking-parse'

export type { NonBannedBustedRow, TrackedCloneAccount }
export { clonesPageUrl, findBustedSection, parseClonesPageMeta, parseNonBannedBustedRows } from '@/services/clone-tracking-parse'

export interface CloneBustedCheckResult {
  userId: string
  username: string
  clonesUrl: string
  nonBannedRows: NonBannedBustedRow[]
}

export const getTrackedCloneAccounts = async (): Promise<TrackedCloneAccount[]> => {
  const config = await getGlobalConfig()
  return config.trackedCloneAccounts
}

export const isCloneAccountTracked = async (userId: string): Promise<boolean> => {
  const tracked = await getTrackedCloneAccounts()
  return tracked.some(account => account.userId === userId)
}

export const addTrackedCloneAccount = async (account: TrackedCloneAccount): Promise<void> => {
  const config = await getGlobalConfig()
  if (config.trackedCloneAccounts.some(entry => entry.userId === account.userId)) return

  await setGlobalConfig({
    ...config,
    trackedCloneAccounts: [...config.trackedCloneAccounts, account]
  })
}

export const removeTrackedCloneAccount = async (userId: string): Promise<void> => {
  const config = await getGlobalConfig()
  await setGlobalConfig({
    ...config,
    trackedCloneAccounts: config.trackedCloneAccounts.filter(entry => entry.userId !== userId)
  })
}

export const fetchClonesDocument = async (userId: string): Promise<Document | null> => {
  try {
    const response = await fetch(clonesPageUrl(userId), { credentials: 'include' })
    if (!response.ok) return null
    const html = await response.text()
    return new DOMParser().parseFromString(html, 'text/html')
  } catch {
    return null
  }
}

export const checkTrackedCloneAccount = async (account: TrackedCloneAccount): Promise<CloneBustedCheckResult | null> => {
  const doc = await fetchClonesDocument(account.userId)
  if (!doc) return null

  const nonBannedRows = parseNonBannedBustedRows(doc)
  if (nonBannedRows.length === 0) return null

  const meta = parseClonesPageMeta(doc, clonesPageUrl(account.userId)) ?? account

  return {
    userId: meta.userId,
    username: meta.username,
    clonesUrl: clonesPageUrl(meta.userId),
    nonBannedRows
  }
}

export const checkAllTrackedCloneAccounts = async (
  accounts: TrackedCloneAccount[] = []
): Promise<CloneBustedCheckResult[]> => {
  const tracked = accounts.length > 0 ? accounts : await getTrackedCloneAccounts()
  if (tracked.length === 0) return []

  const results = await Promise.all(tracked.map(account => checkTrackedCloneAccount(account)))
  return results.filter((result): result is CloneBustedCheckResult => result != null)
}

export const mergeGlobalConfigTrackedAccounts = (config: GlobalConfig): GlobalConfig => ({
  ...config,
  trackedCloneAccounts: config.trackedCloneAccounts ?? []
})
