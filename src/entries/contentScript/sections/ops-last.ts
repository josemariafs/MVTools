import '@/entries/enableDevHmr'

import { devLog } from '@/utils/logging'

const STORAGE_KEY = 'mvOpsLastFilters'

interface FilterState {
  busted: boolean
  ipClones: boolean
  otherLang: boolean
}

const DEFAULT_STATE: FilterState = {
  busted: false,
  ipClones: false,
  otherLang: false
}

function loadState(): FilterState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw == null || raw === '') return DEFAULT_STATE
    const parsed = JSON.parse(raw) as Partial<FilterState>
    return {
      busted: parsed.busted === true,
      ipClones: parsed.ipClones === true,
      otherLang: parsed.otherLang === true
    }
  } catch {
    return DEFAULT_STATE
  }
}

function saveState(state: FilterState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // localStorage no disponible: ignorar
  }
}

/** Griego, cirílico, árabe, hebreo, devanagari, cjk, tailandés, silabos hangul (AC00–D7A3), etc. */
/* eslint-disable no-misleading-character-class -- rangos Unicode \uXXXX explícitos */
const NON_LATIN_SCRIPT_REGEX =
  /[\u0370-\u03FF\u1F00-\u1FFF\u0400-\u04FF\u0600-\u06FF\u0590-\u05FF\u0900-\u097F\u3040-\u30FF\u4E00-\u9FFF\u0E00-\u0E7F\uAC00-\uD7A3]/u

/**
 * Letras latinas que no suelen usarse en español estándar (sí en FR/PT/PL/DE/SE…).
 * No incluimos la ñ ni vocales tildadas propias del español.
 */
const NON_SPANISH_LATIN_LETTER_REGEX =
  /[çÇßàÀâÂäÄåÅæÆèÈéÉêÊëËìÌíÍîÏîðÐòÒóÓôÔõÕöÖøØùÙúÚûÛũŨůŮűŰýÝÿŸœŒØøĄąĆćĈĉČčĎďĘęĚěĢģĦħĮįİıĹĺĻļŁłŃńŅņŇňŊŋŌōŐőŔŕŖŗŘřŚśŞşŠšŢţŤťŮůŰűŲųŴŵŶŷŸŹźŻżŽž]/u
/* eslint-enable no-misleading-character-class */

/**
 * Términos frecuentes en perfiles/inglés tech raros como único bloque en español.
 * Inglés, francés, alemán, portugués, italiano: palabra → normalizada sin acentos.
 */
const EN_FR_DE_PT_IT_WORDS = new Set(
  'the and for not are was were this that with from your you they them their what when where which have has had will would could should can must need want make take give know think feel find look work play game time year home life world about page link here help team email click open view show read more less full part last next back over under great good best cool nice also only very just even both each many such being online offline member player server level message check update version profile user name password account register login create search enter select choose language english please thanks hello welcome sorry admin moderator private public channel video image photo file code test error valid invalid true false free premium steam discord twitter youtube twitch facebook instagram reddit support contact press info start stop close delete remove save post thread reply quote share love hate'
    .split(/\s+/)
    .filter(w => w.length >= 2)
)
const FR_EXTRA = new Set(
  'bonjour salut merci beaucoup madame monsieur bonsoir comme aussi alors depuis pendant toujours encore vous nous leur votre notre toute'
    .split(/\s+/)
    .filter(w => w.length >= 2)
)
const DE_WORDS = new Set(
  'guten gute hallo servus danke bitte schon kein keinen keine deine eurer nicht kann muss wollen werden hier alles denn euch was sind oder noch einem einer einem'
    .split(/\s+/)
    .filter(w => w.length >= 2)
)
/** PT/IT (foldWord: nao ← não, perche ← perché) */
const PT_IT_WORDS = new Set(
  'nao obrigado muito tudo ola voce oggi grazie ciao allora perche anche sempre sono stato bella italia italy'
    .split(/\s+/)
    .filter(w => w.length >= 2)
)

function foldWord(w: string): string {
  return w.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '')
}

function wordLooksNonSpanish(w: string): boolean {
  return EN_FR_DE_PT_IT_WORDS.has(w) || FR_EXTRA.has(w) || DE_WORDS.has(w) || PT_IT_WORDS.has(w) || EN_ASCII_TOKENS.has(w)
}

/**
 * Sólo a-z: palabras técnicas en inglés que se escriben igual en perfiles
 * (evita "el" / "y" y falsos con una sola letra).
 */
const EN_ASCII_TOKENS = new Set(
  'the and for are was this that with you they what when have has had will would could should from your more most only very also just work play game time home life page link help team email user name about click open view read show full best cool good nice part next back over last info free test file code like each such being online member server level check update create search enter select public private close share love hate real world status message profile sorry thanks hello welcome right left point super mega ultra dark light'
    .split(/\s+/)
    .filter(w => w.length >= 3)
)

/**
 * "Otro idioma" frente a sólo letras a-z+acentos castellanos:
 * 1) Alfabetos no latinos, 2) letras latinas 'extranjeras', 3) palabras típica EN/FR/DE/PT/IT.
 * El inglés puro a-z con palabras frecuentes; si no, no se detectaba.
 */
function hasOtherLanguageText(text: string): boolean {
  const cleaned = text.trim()
  if (cleaned === '') return false
  if (NON_LATIN_SCRIPT_REGEX.test(cleaned) || NON_SPANISH_LATIN_LETTER_REGEX.test(cleaned)) return true

  for (const m of cleaned.matchAll(/\p{L}[\p{L}']*/gu)) {
    const raw = m[0]
    if (raw.length < 2) continue
    if (wordLooksNonSpanish(foldWord(raw))) return true
  }
  return false
}

function getPerfilCellText(cell: HTMLTableCellElement | undefined): string {
  if (!cell) return ''
  const fromText = cell.textContent?.trim() ?? ''
  if (fromText.length > 0) return fromText
  if (cell.innerText.trim().length > 0) return cell.innerText.trim()
  return cell.querySelector<HTMLElement>('[title]')?.getAttribute('title')?.trim() ?? ''
}

function findTargetTable(): HTMLTableElement | null {
  const tables = document.querySelectorAll<HTMLTableElement>('table')
  for (const table of tables) {
    const headerTexts = Array.from(table.querySelectorAll('th')).map(h => (h.textContent ?? '').toLowerCase())
    if (headerTexts.some(t => t.includes('busted')) && headerTexts.some(t => t.includes('perfil'))) {
      return table
    }
  }
  return null
}

interface ColumnIndices {
  busted: number
  ipClones: number
  perfil: number
}

function headerLooksLikeIpClones(text: string): boolean {
  if (text.includes('ip clones')) return true
  if (text === 'clones') return true
  return text.includes('clones') && !text.includes('busted')
}

function findColumnIndices(table: HTMLTableElement): ColumnIndices | null {
  const headers = table.querySelectorAll<HTMLTableCellElement>('th')
  let busted = -1
  let ipClones = -1
  let perfil = -1
  headers.forEach((h, i) => {
    const text = (h.textContent ?? '').toLowerCase().replace(/\s+/g, ' ').trim()
    if (busted === -1 && text.includes('busted')) busted = i
    if (ipClones === -1 && headerLooksLikeIpClones(text)) ipClones = i
    if (perfil === -1 && text.includes('perfil')) perfil = i
  })
  if (busted === -1 || perfil === -1) return null
  return { busted, ipClones, perfil }
}

function cellHasMeaningfulContent(cell: HTMLTableCellElement | undefined): boolean {
  if (!cell) return false
  const text = (cell.textContent ?? '').trim()
  if (text === '' || text === '0' || text === '-' || text === '–') return false
  return true
}

function getRows(table: HTMLTableElement): HTMLTableRowElement[] {
  const tbody = table.tBodies[0]
  if (tbody) return Array.from(tbody.rows)
  return Array.from(table.querySelectorAll<HTMLTableRowElement>('tr')).filter(r => r.cells.length > 0 && !r.querySelector('th'))
}

function rowMatchesState(cells: HTMLCollection, cols: ColumnIndices, state: FilterState): boolean {
  if (state.busted && !cellHasMeaningfulContent(cells[cols.busted] as HTMLTableCellElement | undefined)) return false
  if (state.ipClones) {
    if (cols.ipClones === -1) {
      // Sin columna: no filtramos por esto
    } else if (!cellHasMeaningfulContent(cells[cols.ipClones] as HTMLTableCellElement | undefined)) {
      return false
    }
  }
  if (state.otherLang) {
    const cell = cells[cols.perfil] as HTMLTableCellElement | undefined
    const perfilText = getPerfilCellText(cell)
    if (!hasOtherLanguageText(perfilText)) return false
  }
  return true
}

function applyFilters(table: HTMLTableElement, cols: ColumnIndices, state: FilterState): { visible: number; total: number } {
  const rows = getRows(table)
  let visibleCount = 0
  rows.forEach(row => {
    const visible = rowMatchesState(row.cells, cols, state)
    row.style.display = visible ? '' : 'none'
    if (visible) visibleCount += 1
  })
  return { visible: visibleCount, total: rows.length }
}

const PANEL_ID = 'mv-ops-last-filters'

function buildFilterPanel(state: FilterState, hasIpClones: boolean, onChange: (next: FilterState) => void): HTMLElement {
  const wrapper = document.createElement('div')
  wrapper.id = PANEL_ID
  wrapper.innerHTML = `
    <style>
      #${PANEL_ID} {
        display: flex;
        flex-wrap: wrap;
        gap: 10px 16px;
        align-items: center;
        margin: 0 0 18px;
        padding: 14px 18px;
        background: rgba(0, 0, 0, 0.55);
        border: 1px solid #2e3438;
        border-radius: 10px;
        color: #e9e9e9;
        font-size: 14px;
        backdrop-filter: blur(2px);
      }
      #${PANEL_ID} .mv-ops-title {
        font-weight: 600;
        margin-right: 6px;
        color: #b9c8ce;
      }
      #${PANEL_ID} label.mv-ops-opt {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        padding: 6px 12px;
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid #3d454c;
        user-select: none;
        transition: background-color 120ms ease, border-color 120ms ease;
      }
      #${PANEL_ID} label.mv-ops-opt:hover {
        background: rgba(251, 133, 0, 0.10);
        border-color: #fb8500;
      }
      #${PANEL_ID} label.mv-ops-opt input { accent-color: #fb8500; cursor: pointer; }
      #${PANEL_ID} label.mv-ops-opt[data-disabled="true"] {
        opacity: 0.4;
        cursor: not-allowed;
      }
      #${PANEL_ID} .mv-ops-count {
        margin-left: auto;
        color: #b9c8ce;
        font-size: 13px;
      }
      #${PANEL_ID} .mv-ops-reset {
        background: transparent;
        border: 1px solid #3d454c;
        color: #b9c8ce;
        border-radius: 6px;
        padding: 5px 10px;
        cursor: pointer;
        font-size: 12px;
      }
      #${PANEL_ID} .mv-ops-reset:hover {
        border-color: #fb8500;
        color: #fb8500;
      }
    </style>
    <span class="mv-ops-title">Mostrar solo filas:</span>
    <label class="mv-ops-opt">
      <input type="checkbox" data-filter="busted" ${state.busted ? 'checked' : ''}>
      Con Busted
    </label>
    <label class="mv-ops-opt" ${hasIpClones ? '' : 'data-disabled="true" title="Esta tabla no tiene columna IP Clones"'}>
      <input type="checkbox" data-filter="ipClones" ${state.ipClones ? 'checked' : ''} ${hasIpClones ? '' : 'disabled'}>
      Con IP Clones
    </label>
    <label class="mv-ops-opt">
      <input type="checkbox" data-filter="otherLang" ${state.otherLang ? 'checked' : ''}>
      Perfil en otro idioma
    </label>
    <button type="button" class="mv-ops-reset" data-role="reset">Limpiar filtros</button>
    <span class="mv-ops-count" data-role="count"></span>
  `
  let current = state
  wrapper.querySelectorAll<HTMLInputElement>('input[type="checkbox"][data-filter]').forEach(cb => {
    cb.addEventListener('change', () => {
      const k = cb.dataset.filter
      if (k === 'busted' || k === 'ipClones' || k === 'otherLang') {
        current = { ...current, [k]: cb.checked }
        onChange(current)
      }
    })
  })
  wrapper.querySelector<HTMLButtonElement>('[data-role="reset"]')?.addEventListener('click', () => {
    current = { ...DEFAULT_STATE }
    wrapper.querySelectorAll<HTMLInputElement>('input[type="checkbox"][data-filter]').forEach(cb => {
      cb.checked = false
    })
    onChange(current)
  })
  return wrapper
}

function init(): boolean {
  if (document.getElementById(PANEL_ID)) return true
  const table = findTargetTable()
  if (!table) return false
  const cols = findColumnIndices(table)
  if (!cols) {
    devLog.log('ops-last: no se encontraron columnas requeridas (busted/perfil)')
    return false
  }
  let state = loadState()
  if (cols.ipClones === -1) {
    state = { ...state, ipClones: false }
  }
  let suppressObserver = false

  const updateCounter = (visible: number, total: number) => {
    const counter = document.querySelector<HTMLElement>('#' + PANEL_ID + ' [data-role="count"]')
    if (counter) counter.textContent = `${visible} / ${total} filas`
  }

  const handleChange = (next: FilterState): void => {
    state = next
    saveState(state)
    suppressObserver = true
    const { visible, total } = applyFilters(table, cols, state)
    updateCounter(visible, total)
    queueMicrotask(() => {
      suppressObserver = false
    })
  }

  const panel = buildFilterPanel(state, cols.ipClones !== -1, handleChange)
  table.parentElement?.insertBefore(panel, table)
  const initial = applyFilters(table, cols, state)
  updateCounter(initial.visible, initial.total)

  const obs = new MutationObserver(() => {
    if (suppressObserver) return
    const result = applyFilters(table, cols, state)
    updateCounter(result.visible, result.total)
  })
  obs.observe(table.tBodies[0] ?? table, { childList: true, subtree: false })

  devLog.log('ops-last: filtros activos', state, 'columnas', cols)
  return true
}

function bootstrap(): void {
  if (init()) return
  let attempts = 0
  const interval = window.setInterval(() => {
    attempts += 1
    if (init() || attempts >= 20) window.clearInterval(interval)
  }, 200)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap, { once: true })
} else {
  bootstrap()
}
