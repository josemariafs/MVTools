import { URLS } from '@/constants'
import { getGlobalConfig, setGlobalConfig, type GlobalConfig } from '@/services/config'
import {
  clonesPageUrl,
  findBustedSection,
  findIpClonesSection,
  parseAllCloneIdentities,
  parseAllCloneLabels,
  parseNonBannedCloneRows,
  profilePageUrl,
  type NonBannedBustedRow,
  type TrackedCloneAccount
} from '@/services/clone-tracking-parse'

/**
 * Logger de diagnóstico TEMPORAL: imprime siempre (incl. producción) para depurar
 * el seguimiento de clones en el navegador del usuario. Quitar cuando se resuelva.
 */
// eslint-disable-next-line no-restricted-syntax -- diagnóstico temporal de clone-tracking
const traceLog = (...args: unknown[]) => console.log('[MV Clones]', ...args)

export type { NonBannedBustedRow, TrackedCloneAccount }
export {
  clonesPageUrl,
  findBustedSection,
  findIpClonesSection,
  parseAllCloneIdentities,
  parseAllCloneLabels,
  parseClonesPageMeta,
  parseNonBannedBustedRows,
  parseNonBannedCloneRows,
  parseNonBannedIpCloneRows,
  profilePageUrl
} from '@/services/clone-tracking-parse'

export interface CloneBustedCheckResult {
  userId: string
  username: string
  clonesUrl: string
  nonBannedRows: NonBannedBustedRow[]
}

interface CascadeContext {
  username: string
  clonesUrl: string
}

const userIdByNicknameCache = new Map<string, string | null>()

/** joincheck con do=username devuelve 1 si existe; los IDs reales son >= 100. */
export const MIN_MEDIAVIDA_USER_ID = 100

export const parseJoincheckUserId = (data: unknown): string | null => {
  const numeric = typeof data === 'number' ? data : typeof data === 'string' ? Number(data) : NaN
  if (!Number.isFinite(numeric) || numeric < MIN_MEDIAVIDA_USER_ID) return null
  return String(Math.trunc(numeric))
}

const requestJoincheckUserId = async (nickname: string, doParam: 'username' | 'userid'): Promise<string | null> => {
  const response = await fetch(`${URLS.MEDIAVIDA}/usuarios/action/joincheck.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: `do=${doParam}&q=${encodeURIComponent(nickname)}`,
    credentials: 'include'
  })

  if (!response.ok) return null

  const data = (await response.json()) as unknown
  return parseJoincheckUserId(data)
}

const extractUserIdFromProfileHtml = (html: string, responseUrl: string): string | null => {
  try {
    const url = new URL(responseUrl, URLS.MEDIAVIDA)
    if (url.pathname.includes('clones.php') || url.pathname.includes('perfil')) {
      const fromUrl = url.searchParams.get('id')?.trim()
      if (fromUrl) return fromUrl
    }
  } catch {
    // ignore malformed URL
  }

  const patterns = [
    /(?:usuarios\/)?clones\.php\?[^"' >]*id=(\d+)/i,
    /perfil\.php\?[^"' >]*id=(\d+)/i
  ]

  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match?.[1]) return match[1]
  }

  return null
}

/** Resuelve nick → id vía la página pública /id/{nick} (enlace mod «buscar clones»). */
export const resolveUserIdFromProfilePage = async (nickname: string): Promise<string | null> => {
  const key = nickname.trim()
  if (!key) return null

  try {
    const response = await fetch(`${URLS.MEDIAVIDA}/id/${encodeURIComponent(key)}`, {
      credentials: 'include',
      redirect: 'follow'
    })

    if (!response.ok) return null

    const html = await response.text()
    return extractUserIdFromProfileHtml(html, response.url)
  } catch {
    return null
  }
}

const dedupeNonBannedRows = (rows: NonBannedBustedRow[]): NonBannedBustedRow[] => {
  const seen = new Set<string>()
  return rows.filter(row => {
    const key = row.label.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

const safeResolve = async (fn: () => Promise<string | null>): Promise<string | null> => {
  try {
    return await fn()
  } catch {
    return null
  }
}

export const resolveUserIdByNickname = async (nickname: string): Promise<string | null> => {
  const key = nickname.trim()
  if (!key) return null
  if (userIdByNicknameCache.has(key)) return userIdByNicknameCache.get(key) ?? null

  // En clones.php los nicks enlazan a /id/{nick} (sin id numérico). La fuente fiable del
  // id es la página de perfil del usuario, que para un moderador incluye el enlace
  // «buscar clones» → clones.php?id={id}. joincheck solo confirma existencia (devuelve 1).
  let userId = await safeResolve(() => resolveUserIdFromProfilePage(key))
  let source = 'perfil'

  if (!userId) {
    userId = await safeResolve(() => requestJoincheckUserId(key, 'userid'))
    source = 'joincheck'
  }

  traceLog(`nick "${key}" → id=${userId ?? 'NO RESUELTO'} (${userId ? source : 'ninguno'})`)
  userIdByNicknameCache.set(key, userId)
  return userId
}

const enrichRowsWithProfileUrls = async (rows: NonBannedBustedRow[]): Promise<NonBannedBustedRow[]> =>
  Promise.all(
    rows.map(async row => {
      if (row.profileUrl) return row

      const userId = await resolveUserIdByNickname(row.label)
      if (!userId) return row

      return { ...row, profileUrl: profilePageUrl(userId) }
    })
  )

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
    if (!response.ok) {
      traceLog(`fetch ${response.status} clones.php?id=${userId}`)
      return null
    }
    const html = await response.text()
    return new DOMParser().parseFromString(html, 'text/html')
  } catch (error) {
    traceLog(`fetch ERROR clones.php?id=${userId}`, error)
    return null
  }
}

const attachCascadeContext = (rows: NonBannedBustedRow[], via?: CascadeContext): NonBannedBustedRow[] =>
  rows.map(row => ({
    ...row,
    ...(via
      ? {
          viaUsername: via.username,
          viaClonesUrl: via.clonesUrl
        }
      : {})
  }))

const normalizeNickname = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()

const resolveCascadeChildren = async (
  doc: Document,
  visited: Set<string>
): Promise<TrackedCloneAccount[]> => {
  const linked = parseAllCloneIdentities(doc)
  const labels = parseAllCloneLabels(doc)
  const children: TrackedCloneAccount[] = []
  const seenUserIds = new Set<string>()
  const seenLabels = new Set<string>()

  for (const identity of linked) {
    if (visited.has(identity.userId) || seenUserIds.has(identity.userId)) continue
    seenUserIds.add(identity.userId)
    seenLabels.add(normalizeNickname(identity.username))
    traceLog(`cascada ${identity.username} → clones.php?id=${identity.userId} (html)`)
    children.push({ userId: identity.userId, username: identity.username })
  }

  for (const label of labels) {
    const labelKey = normalizeNickname(label)
    if (seenLabels.has(labelKey)) continue
    seenLabels.add(labelKey)

    const userId = await resolveUserIdByNickname(label)
    if (!userId || visited.has(userId) || seenUserIds.has(userId)) continue

    seenUserIds.add(userId)
    traceLog(`cascada ${label} → clones.php?id=${userId} (nick)`)
    children.push({ userId, username: label })
  }

  return children
}

/**
 * Profundidad máxima de la cascada (cuenta seguida = 0). Con 1 nivel se leen los clones
 * directos de la cuenta seguida (p. ej. Leh → Lunara) y sus busteds (p. ej. Novelist),
 * pero no se sigue más abajo. Evita aluviones de peticiones (clones de clones de clones).
 */
const MAX_CASCADE_DEPTH = 1

const crawlCloneTree = async (
  account: TrackedCloneAccount,
  visited: Set<string>,
  via?: CascadeContext,
  depth = 0
): Promise<NonBannedBustedRow[]> => {
  if (visited.has(account.userId)) return []
  visited.add(account.userId)

  traceLog(`visitando clones.php?id=${account.userId} (${account.username}) [profundidad ${depth}]`)
  const doc = await fetchClonesDocument(account.userId)
  if (!doc) {
    traceLog(`SIN DOC para ${account.username} (id=${account.userId}) — fetch falló o vacío`)
    return []
  }

  const bustedSection = findBustedSection(doc)
  const ipSection = findIpClonesSection(doc)
  traceLog(
    `secciones de ${account.username}: Busted=${bustedSection ? 'SÍ' : 'NO'}, IPs=${ipSection ? 'SÍ' : 'NO'}`
  )
  if (bustedSection) traceLog(`HTML Busted de ${account.username}:`, bustedSection.outerHTML.slice(0, 3000))

  const rows: NonBannedBustedRow[] = attachCascadeContext(parseNonBannedCloneRows(doc), via)
  traceLog(`filas no baneadas directas en ${account.username}:`, rows.map(r => r.label))

  if (depth >= MAX_CASCADE_DEPTH) {
    traceLog(`profundidad máxima alcanzada en ${account.username}, no se exploran más clones`)
    return rows
  }

  const childIdentities = await resolveCascadeChildren(doc, visited)
  traceLog(`hijos a explorar desde ${account.username}:`, childIdentities.map(c => `${c.username}#${c.userId}`))
  for (const child of childIdentities) {
    if (visited.has(child.userId)) continue

    const childRows = await crawlCloneTree(
      { userId: child.userId, username: child.username },
      visited,
      {
        username: child.username,
        clonesUrl: clonesPageUrl(child.userId)
      },
      depth + 1
    )
    rows.push(...childRows)
  }

  return rows
}

export const checkTrackedCloneAccount = async (account: TrackedCloneAccount): Promise<CloneBustedCheckResult | null> => {
  const visited = new Set<string>()
  const nonBannedRows = dedupeNonBannedRows(await enrichRowsWithProfileUrls(await crawlCloneTree(account, visited)))

  if (nonBannedRows.length === 0) {
    traceLog(`${account.username} (id=${account.userId}) → SIN ALERTAS`)
    return null
  }

  traceLog(`${account.username} (id=${account.userId}) → ${nonBannedRows.length} no baneada(s):`, nonBannedRows)

  return {
    userId: account.userId,
    username: account.username,
    clonesUrl: clonesPageUrl(account.userId),
    nonBannedRows
  }
}

export const checkAllTrackedCloneAccounts = async (
  accounts: TrackedCloneAccount[] = []
): Promise<CloneBustedCheckResult[]> => {
  userIdByNicknameCache.clear()

  const tracked = accounts.length > 0 ? accounts : await getTrackedCloneAccounts()
  traceLog(`cuentas en seguimiento: ${tracked.length}`, tracked.map(t => `${t.username}#${t.userId}`))
  if (tracked.length === 0) return []

  const results = await Promise.all(tracked.map(account => checkTrackedCloneAccount(account)))
  return results.filter((result): result is CloneBustedCheckResult => result != null)
}

export const mergeGlobalConfigTrackedAccounts = (config: GlobalConfig): GlobalConfig => ({
  ...config,
  trackedCloneAccounts: config.trackedCloneAccounts ?? []
})
