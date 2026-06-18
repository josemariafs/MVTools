import { URLS } from '@/constants'

export interface TrackedCloneAccount {
  userId: string
  username: string
}

export interface NonBannedBustedRow {
  label: string
  status: string
  profileUrl?: string
  /** Cuenta intermedia en la cadena de clones (p. ej. Novelist vía Lunara). */
  viaUsername?: string
  viaClonesUrl?: string
}

export interface ClonePageIdentity {
  userId: string
  username: string
  profileUrl: string
}

const normalize = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()

/** Cuentas ya gestionadas: baneadas o desactivadas — no requieren aviso. */
const isResolvedBustedStatus = (status: string, html = ''): boolean => {
  const normalizedHtml = html.toLowerCase()
  if (normalizedHtml.includes('<strong>b</strong>')) return true
  if (normalizedHtml.includes('<strong>d</strong>')) return true

  const n = normalize(status)
  if (!n) return false

  if (n.includes('baneado') || n.includes('banned')) return true
  if (n.includes('desactivado') || n.includes('deactivated')) return true
  if (n === 'b' || n === 'd') return true

  return false
}

const parseEstadoFromCell = (cell: HTMLTableCellElement | null | undefined): { status: string; html: string } => {
  const html = cell?.innerHTML ?? ''
  const status = cell?.textContent?.trim() ?? ''
  return { status, html }
}

const cellHasMeaningfulContent = (cell: HTMLTableCellElement | null | undefined): boolean => {
  const text = cell?.textContent?.trim() ?? ''
  return text.length > 0 && text !== '-' && text !== '—'
}

const isNameColumnHeader = (text: string): boolean =>
  text.includes('nombre') ||
  text.includes('perfil') ||
  text.includes('nick') ||
  text.includes('usuario') ||
  text.includes('cuenta') ||
  text.includes('login') ||
  text === 'name'

export const profilePageUrl = (userId: string): string =>
  `${URLS.MEDIAVIDA}/perfil.php?id=${encodeURIComponent(userId)}`

const extractUserIdFromMediavidaUrl = (url: URL): string | null => {
  if (url.pathname.includes('clones.php') || url.pathname.includes('perfil')) {
    return url.searchParams.get('id')?.trim() ?? null
  }

  return null
}

const extractUserIdFromHref = (href: string): { userId: string; isClonesLink: boolean } | null => {
  if (!href || href === '#') return null

  try {
    const url = new URL(href, URLS.MEDIAVIDA)
    const userId = extractUserIdFromMediavidaUrl(url)
    if (!userId) return null

    return { userId, isClonesLink: url.pathname.includes('clones.php') }
  } catch {
    return null
  }
}

const isValidCloneLabel = (label: string): boolean =>
  Boolean(label) && !isIpLikeLabel(label) && !isNumericOnlyLabel(label)

const extractIdentityFromAnchor = (anchor: HTMLAnchorElement): ClonePageIdentity | null => {
  const parsed = extractUserIdFromHref(anchor.getAttribute('href') ?? '')
  if (!parsed) return null

  const label = anchor.textContent?.trim() ?? ''
  if (!isValidCloneLabel(label)) return null

  return {
    userId: parsed.userId,
    username: label,
    profileUrl: profilePageUrl(parsed.userId)
  }
}

const extractUserIdsFromRowHtml = (row: Element): string[] => {
  const ids: string[] = []
  const seen = new Set<string>()

  for (const anchor of row.querySelectorAll<HTMLAnchorElement>('a[href]')) {
    const parsed = extractUserIdFromHref(anchor.getAttribute('href') ?? '')
    if (!parsed || seen.has(parsed.userId)) continue
    seen.add(parsed.userId)
    ids.push(parsed.userId)
  }

  const html = row.innerHTML
  const patterns = [
    /(?:usuarios\/)?clones\.php\?[^"' >]*(?:^|[?&])id=(\d+)/gi,
    /perfil\.php\?[^"' >]*(?:^|[?&])id=(\d+)/gi
  ]

  for (const pattern of patterns) {
    for (const match of html.matchAll(pattern)) {
      const userId = match[1]
      if (!seen.has(userId)) {
        seen.add(userId)
        ids.push(userId)
      }
    }
  }

  return ids
}

const findIdentityInRow = (row: Element, fallbackLabel?: string): ClonePageIdentity | null => {
  let profileIdentity: ClonePageIdentity | null = null
  let clonesUserId: string | null = null
  let profileUserId: string | null = null

  for (const anchor of row.querySelectorAll<HTMLAnchorElement>('a[href]')) {
    const parsed = extractUserIdFromHref(anchor.getAttribute('href') ?? '')
    if (!parsed) continue

    const label = anchor.textContent?.trim() ?? ''
    if (isValidCloneLabel(label)) {
      const identity: ClonePageIdentity = {
        userId: parsed.userId,
        username: label,
        profileUrl: profilePageUrl(parsed.userId)
      }
      if (parsed.isClonesLink) return identity
      profileIdentity ??= identity
      continue
    }

    if (parsed.isClonesLink) clonesUserId ??= parsed.userId
    else profileUserId ??= parsed.userId
  }

  if (profileIdentity) return profileIdentity

  const username = fallbackLabel?.trim()
  const userId = clonesUserId ?? profileUserId
  if (userId && username && isValidCloneLabel(username)) {
    return { userId, username, profileUrl: profilePageUrl(userId) }
  }

  const [htmlUserId] = extractUserIdsFromRowHtml(row)
  if (htmlUserId && username && isValidCloneLabel(username)) {
    return { userId: htmlUserId, username, profileUrl: profilePageUrl(htmlUserId) }
  }

  return null
}

const isNumericOnlyLabel = (label: string): boolean => /^\d+$/.test(label.trim())

const isIpLikeLabel = (label: string): boolean => {
  const text = label.trim()
  if (!text) return true
  if (text.includes('xxx')) return true
  return /\d{1,3}(?:\.\d{1,3}){2,}/.test(text)
}

const findSectionByHeading = (doc: Document, headingMatches: (normalized: string) => boolean): Element | null => {
  for (const heading of doc.querySelectorAll<HTMLElement>('h3, h4, h5')) {
    const text = normalize(heading.textContent ?? '')
    if (!headingMatches(text)) continue
    return heading.closest('.eqcol') ?? heading.parentElement
  }

  return null
}

/** Localiza la sección «Busted» en el DOM de clones.php. */
export const findBustedSection = (doc: Document): Element | null =>
  findSectionByHeading(doc, text => text === 'busted' || text.startsWith('busted '))

/** Localiza la sección «IPs con clones» en el DOM de clones.php. */
export const findIpClonesSection = (doc: Document): Element | null =>
  findSectionByHeading(doc, text => text.includes('ips con clones'))

const resolveTableColumnIndexes = (table: HTMLTableElement): { estadoIndex: number; nombreIndex: number } | null => {
  let headerRow = table.querySelector<HTMLTableRowElement>('thead tr')
  if (!headerRow) {
    const firstRow = table.querySelector<HTMLTableRowElement>('tr')
    if (firstRow?.querySelector('th')) headerRow = firstRow
  }

  const headerCells = headerRow
    ? Array.from(headerRow.querySelectorAll<HTMLTableCellElement>('th, td'))
    : []

  let estadoIndex = -1
  let nombreIndex = 0
  const hasHeaderRow = headerRow?.querySelector('th') != null

  headerCells.forEach((cell, index) => {
    const text = normalize(cell.textContent ?? '')
    if (text.includes('estado') || text.includes('baneado') || text.includes('sancion')) estadoIndex = index
    if (isNameColumnHeader(text)) nombreIndex = index
  })

  const bodyRow = table.querySelector<HTMLTableRowElement>('tbody tr') ?? table.querySelector<HTMLTableRowElement>('tr')
  const bodyCellCount = bodyRow?.querySelectorAll('td').length ?? 0

  if (estadoIndex === -1 && bodyCellCount > 0) {
    estadoIndex = bodyCellCount - 1
  }

  if (estadoIndex === -1) return null

  if (!hasHeaderRow && bodyCellCount > 1) {
    nombreIndex = 0
  }

  return { estadoIndex, nombreIndex }
}

const plainNombreLabel = (nombreCell: HTMLTableCellElement | undefined): string | null => {
  const label = nombreCell?.textContent?.trim() ?? ''
  return isValidCloneLabel(label) ? label : null
}

const resolveRowIdentity = (
  tr: HTMLTableRowElement,
  nombreCell: HTMLTableCellElement | undefined
): { label: string; profileUrl?: string } | null => {
  const fallbackLabel = plainNombreLabel(nombreCell)
  const identity = findIdentityInRow(tr, fallbackLabel ?? undefined)
  if (identity) {
    return { label: identity.username, profileUrl: identity.profileUrl }
  }

  const anchor = nombreCell?.querySelector('a')
  if (anchor) {
    const fromAnchor = extractIdentityFromAnchor(anchor)
    if (fromAnchor) {
      return { label: fromAnchor.username, profileUrl: fromAnchor.profileUrl }
    }
  }

  if (!fallbackLabel) return null

  return { label: fallbackLabel }
}

const parseTableNonBannedRows = (table: HTMLTableElement): NonBannedBustedRow[] => {
  const columns = resolveTableColumnIndexes(table)
  if (!columns) return []

  const { estadoIndex, nombreIndex } = columns
  const rows: NonBannedBustedRow[] = []

  for (const tr of table.querySelectorAll<HTMLTableRowElement>('tbody tr, tr')) {
    if (tr.querySelector('th')) continue
    const cells = tr.querySelectorAll<HTMLTableCellElement>('td')
    if (cells.length === 0) continue

    const estadoCell = cells[estadoIndex]
    const nombreCell = cells[nombreIndex]
    const identity = resolveRowIdentity(tr, nombreCell)
    if (!identity) continue

    const { status, html } = parseEstadoFromCell(estadoCell)
    if (isResolvedBustedStatus(status, html)) continue

    rows.push({
      label: identity.label || 'Cuenta sin nombre',
      status: status || '(sin estado)',
      profileUrl: identity.profileUrl
    })
  }

  return rows
}

const parseSectionTableRows = (section: Element): NonBannedBustedRow[] => {
  const rows: NonBannedBustedRow[] = []
  for (const table of section.querySelectorAll('table')) {
    rows.push(...parseTableNonBannedRows(table))
  }
  return rows
}

const parseListNonBannedRows = (section: Element): NonBannedBustedRow[] => {
  const rows: NonBannedBustedRow[] = []

  for (const li of section.querySelectorAll<HTMLLIElement>('ul li')) {
    const html = li.innerHTML
    const text = li.textContent?.trim() ?? ''
    if (!text) continue

    if (html.includes('<strong>b</strong>') || html.includes('<strong>d</strong>') || isResolvedBustedStatus(text, html)) {
      continue
    }
    if (!html.includes('<strong>p</strong>') && !cellHasMeaningfulContent(li)) {
      continue
    }

    const label = extractListItemLabel(li)
    if (!label) continue

    const identity = findIdentityInRow(li, label)
    rows.push({
      label,
      status: html.includes('<strong>p</strong>') ? 'sanción activa' : '(sin estado)',
      profileUrl: identity?.profileUrl
    })
  }

  return rows
}

const parseSectionNonBannedRows = (section: Element): NonBannedBustedRow[] => {
  const rows: NonBannedBustedRow[] = []
  if (section.querySelector('table')) {
    rows.push(...parseSectionTableRows(section))
  }
  if (section.querySelector('ul li')) {
    rows.push(...parseListNonBannedRows(section))
  }
  return rows
}

const extractUserIdFromProfileUrl = (profileUrl: string): string | null => {
  try {
    return extractUserIdFromMediavidaUrl(new URL(profileUrl, URLS.MEDIAVIDA))
  } catch {
    return null
  }
}

const stripStatusSuffixFromLabel = (label: string): string =>
  label
    .replace(/\s*(?:baneado|banned|desactivado|deactivated)\s*$/i, '')
    .replace(/\s+[bdp]\s*$/i, '')
    .trim()

/** Nick legible en un `<li>` de Busted (sin marcadores b/d/p ni texto del icono clones). */
const extractListItemLabel = (li: HTMLLIElement): string | null => {
  const anchor = li.querySelector<HTMLAnchorElement>('a[href]')
  const anchorText = anchor?.textContent?.trim() ?? ''
  if (isValidCloneLabel(anchorText)) return anchorText

  const clone = li.cloneNode(true) as HTMLLIElement
  clone.querySelectorAll('strong').forEach(element => element.remove())
  clone.querySelectorAll('a[href*="clones.php"]').forEach(element => element.remove())

  const cleaned = stripStatusSuffixFromLabel(clone.textContent?.trim() ?? '')
  return isValidCloneLabel(cleaned) ? cleaned : null
}

const parseListAllCloneLabels = (section: Element): string[] => {
  const labels: string[] = []

  for (const li of section.querySelectorAll<HTMLLIElement>('ul li')) {
    const label = extractListItemLabel(li)
    if (!label) continue
    labels.push(label)
  }

  return labels
}

const parseTableAllCloneLabels = (table: HTMLTableElement): string[] => {
  const columns = resolveTableColumnIndexes(table)
  if (!columns) return []

  const { nombreIndex } = columns
  const labels: string[] = []

  for (const tr of table.querySelectorAll<HTMLTableRowElement>('tbody tr, tr')) {
    if (tr.querySelector('th')) continue
    const cells = tr.querySelectorAll<HTMLTableCellElement>('td')
    if (cells.length === 0) continue

    const identity = resolveRowIdentity(tr, cells[nombreIndex])
    if (identity?.label) labels.push(identity.label)
  }

  return labels
}

const parseSectionAllCloneLabels = (section: Element): string[] => {
  if (section.querySelector('table')) {
    const labels: string[] = []
    for (const table of section.querySelectorAll('table')) {
      labels.push(...parseTableAllCloneLabels(table))
    }
    return labels
  }

  return parseListAllCloneLabels(section)
}

const dedupeLabels = (labels: string[]): string[] => {
  const seen = new Set<string>()
  return labels.filter(label => {
    const key = normalize(label)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

/**
 * Nicks para la cascada: SOLO la sección «Busted». No se siguen los clones de
 * «IPs con clones» (son coincidencias por IP, no clones confirmados de la cuenta).
 */
export const parseAllCloneLabels = (doc: Document): string[] => {
  const busted = findBustedSection(doc)
  if (!busted) return []
  return dedupeLabels(parseSectionAllCloneLabels(busted))
}

const parseTableAllCloneIdentities = (table: HTMLTableElement): ClonePageIdentity[] => {
  const columns = resolveTableColumnIndexes(table)
  if (!columns) return []

  const { nombreIndex } = columns
  const identities: ClonePageIdentity[] = []

  for (const tr of table.querySelectorAll<HTMLTableRowElement>('tbody tr, tr')) {
    if (tr.querySelector('th')) continue
    const cells = tr.querySelectorAll<HTMLTableCellElement>('td')
    if (cells.length === 0) continue

    const fallbackLabel = plainNombreLabel(cells[nombreIndex])
    const identity = findIdentityInRow(tr, fallbackLabel ?? undefined)
    if (identity) identities.push(identity)
  }

  return identities
}

const parseListAllCloneIdentities = (section: Element): ClonePageIdentity[] => {
  const identities: ClonePageIdentity[] = []

  for (const li of section.querySelectorAll<HTMLLIElement>('ul li')) {
    const fallbackLabel = extractListItemLabel(li)
    if (!fallbackLabel) continue

    const identity = findIdentityInRow(li, fallbackLabel)
    if (identity) identities.push(identity)
  }

  return identities
}

const parseSectionAllCloneIdentities = (section: Element): ClonePageIdentity[] => {
  if (section.querySelector('table')) {
    const identities: ClonePageIdentity[] = []
    for (const table of section.querySelectorAll('table')) {
      identities.push(...parseTableAllCloneIdentities(table))
    }
    return identities
  }

  return parseListAllCloneIdentities(section)
}

const dedupeIdentitiesByUserId = (identities: ClonePageIdentity[]): ClonePageIdentity[] => {
  const seen = new Set<string>()
  return identities.filter(identity => {
    if (seen.has(identity.userId)) return false
    seen.add(identity.userId)
    return true
  })
}

/** Cuentas clon de la cascada: SOLO la sección «Busted» (no «IPs con clones»). */
export const parseAllCloneIdentities = (doc: Document): ClonePageIdentity[] => {
  const busted = findBustedSection(doc)
  if (!busted) return []
  return dedupeIdentitiesByUserId(parseSectionAllCloneIdentities(busted))
}

const dedupeRowsByLabel = (rows: NonBannedBustedRow[]): NonBannedBustedRow[] => {
  const seen = new Set<string>()
  return rows.filter(row => {
    const key = normalize(row.label)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

/** Filas no baneadas en el apartado «Busted». */
export const parseNonBannedBustedRows = (doc: Document): NonBannedBustedRow[] => {
  const section = findBustedSection(doc)
  if (!section) return []
  return parseSectionNonBannedRows(section)
}

/** Clones activos detectados por IP (estado vacío o sin baneo/desactivación). */
export const parseNonBannedIpCloneRows = (doc: Document): NonBannedBustedRow[] => {
  const section = findIpClonesSection(doc)
  if (!section) return []
  return parseSectionNonBannedRows(section)
}

/** Cuentas clon no baneadas en Busted (solo esta sección). */
export const parseNonBannedCloneRows = (doc: Document): NonBannedBustedRow[] =>
  parseNonBannedBustedRows(doc)

export const parseClonesPageMeta = (doc: Document, pageUrl: string): TrackedCloneAccount | null => {
  const url = new URL(pageUrl, URLS.MEDIAVIDA)
  const userId = url.searchParams.get('id')?.trim()
  if (!userId) return null

  const headingText =
    doc.querySelector<HTMLElement>('h1')?.textContent?.trim() ??
    doc.querySelector<HTMLElement>('.sp h3')?.textContent?.trim() ??
    doc.title

  const match = headingText.match(/clones de\s+(.+)/i)
  const username = match?.[1]?.trim() || userId

  return { userId, username }
}

export const clonesPageUrl = (userId: string): string =>
  `${URLS.MEDIAVIDA}/usuarios/clones.php?id=${encodeURIComponent(userId)}`
