/**
 * Convierte fechas tipo tienda Steam (`"30 ABR 2026"`, `"26 Nov. 2026"`) a `YYYY-MM-DD`.
 */
export function parseSteamReleaseDateToIso(dateRaw: string | undefined | null): string | null {
  if (!dateRaw?.trim()) return null
  const cleaned = dateRaw.trim().toUpperCase().replace(/\.$/g, '')
  const m = /^(\d{1,2})\s+([A-Z]{3})\.?\s+(\d{4})$/.exec(cleaned)
  if (!m) return null

  const es: Record<string, string> = {
    ENE: '01',
    FEB: '02',
    MAR: '03',
    ABR: '04',
    MAY: '05',
    JUN: '06',
    JUL: '07',
    AGO: '08',
    SEP: '09',
    OCT: '10',
    NOV: '11',
    DIC: '12'
  }
  const en: Record<string, string> = {
    JAN: '01',
    FEB: '02',
    MAR: '03',
    APR: '04',
    MAY: '05',
    JUN: '06',
    JUL: '07',
    AUG: '08',
    SEP: '09',
    OCT: '10',
    NOV: '11',
    DEC: '12'
  }

  const day = m[1]!.padStart(2, '0')
  const monKey = m[2]!.replace(/\.$/, '')
  const year = m[3]!
  const month = es[monKey] ?? en[monKey]
  if (!month) return null
  return `${year}-${month}-${day}`
}
