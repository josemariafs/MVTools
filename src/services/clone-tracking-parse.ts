import { URLS } from '@/constants'

export interface TrackedCloneAccount {
  userId: string
  username: string
}

export interface NonBannedBustedRow {
  label: string
  status: string
}

const normalize = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()

const isBannedStatus = (status: string): boolean => {
  const n = normalize(status)
  return n === 'baneado' || n === 'b' || n === 'banned'
}

const cellHasMeaningfulContent = (cell: HTMLTableCellElement | null | undefined): boolean => {
  const text = cell?.textContent?.trim() ?? ''
  return text.length > 0 && text !== '-' && text !== '—'
}

/** Localiza la sección «Busted» en el DOM de clones.php. */
export const findBustedSection = (doc: Document): Element | null => {
  for (const heading of doc.querySelectorAll<HTMLElement>('h3, h4, h5')) {
    if (normalize(heading.textContent ?? '') !== 'busted') continue
    return heading.closest('.eqcol') ?? heading.parentElement
  }

  const eqcols = doc.querySelectorAll<HTMLElement>('.eqcol')
  if (eqcols.length === 1) return eqcols[0] ?? null

  return null
}

const parseTableNonBannedRows = (section: Element): NonBannedBustedRow[] => {
  const table = section.querySelector('table')
  if (!table) return []

  const headerCells = table.querySelectorAll<HTMLTableCellElement>('thead th, thead td, tr:first-child th, tr:first-child td')
  let estadoIndex = -1
  let nombreIndex = 0

  headerCells.forEach((cell, index) => {
    const text = normalize(cell.textContent ?? '')
    if (text.includes('estado')) estadoIndex = index
    if (text.includes('nombre')) nombreIndex = index
  })

  if (estadoIndex === -1) return []

  const rows: NonBannedBustedRow[] = []
  for (const tr of table.querySelectorAll<HTMLTableRowElement>('tbody tr, tr')) {
    if (tr.querySelector('th')) continue
    const cells = tr.querySelectorAll<HTMLTableCellElement>('td')
    if (cells.length === 0) continue

    const estadoCell = cells[estadoIndex]
    const nombreCell = cells[nombreIndex]
    if (!cellHasMeaningfulContent(nombreCell)) continue

    const status = estadoCell?.textContent?.trim() ?? ''
    if (isBannedStatus(status)) continue

    rows.push({
      label: nombreCell.textContent?.trim() || 'Cuenta sin nombre',
      status: status || '(sin estado)'
    })
  }

  return rows
}

const parseListNonBannedRows = (section: Element): NonBannedBustedRow[] => {
  const rows: NonBannedBustedRow[] = []

  for (const li of section.querySelectorAll<HTMLLIElement>('ul li')) {
    const html = li.innerHTML
    const text = li.textContent?.trim() ?? ''
    if (!text) continue

    if (html.includes('<strong>b</strong>') || isBannedStatus(text)) continue
    if (!html.includes('<strong>p</strong>') && !html.includes('<strong>d</strong>') && !cellHasMeaningfulContent(li)) {
      continue
    }

    const anchor = li.querySelector('a')
    rows.push({
      label: anchor?.textContent?.trim() || text.slice(0, 80),
      status: html.includes('<strong>p</strong>')
        ? 'sanción activa'
        : html.includes('<strong>d</strong>')
          ? 'cuenta desactivada'
          : text
    })
  }

  return rows
}

/** Devuelve filas del apartado Busted cuyo estado no es «baneado». */
export const parseNonBannedBustedRows = (doc: Document): NonBannedBustedRow[] => {
  const section = findBustedSection(doc)
  if (!section) return []

  const fromTable = parseTableNonBannedRows(section)
  if (fromTable.length > 0) return fromTable

  return parseListNonBannedRows(section)
}

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
