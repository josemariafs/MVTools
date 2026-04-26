import '@/entries/enableDevHmr'

import { devLog } from '@/utils/logging'

const BAN_CLASS = 'mvProfileBanLegible'
const ACTION_CLASS = 'mvProfileBanAction'
const LAYOUT_CLASS = 'mvProfileBanLayout'
const BAN_ACTION_STYLE_ID = 'mv-ext-profile-ban-action-pill'
/** En body: activa CSS que sube el menú mod (escudo) por encima del cajetín de baneo (orden en el DOM). */
const BODY_PROFILE_BAN_CLASS = 'mvToolsProfileBan'
const ANCHOR_LINK = /levantar castigo|buscar clones|modificar detalles de baneo/i

function updateBodyProfileBanFlag(): void {
  document.body.classList.toggle(BODY_PROFILE_BAN_CLASS, document.querySelector(`.${BAN_CLASS}`) != null)
}

/**
 * El CSS de content_scripts se inserta pronto; Mediavida aplica estilos a los enlaces de mod
 * más tarde (con `!important`). Inyectar al final del body gana en cascada, mismo criterio que
 * en premium-styles: pastillas de /ops/last (`label.mv-ops-opt`).
 */
function ensureProfileBanActionStyles(): void {
  if (document.getElementById(BAN_ACTION_STYLE_ID) != null) return
  const parent = document.body ?? document.head ?? document.documentElement
  if (parent == null) return
  const el = document.createElement('style')
  el.id = BAN_ACTION_STYLE_ID
  el.textContent = `html body .mvProfileBanLegible a.${ACTION_CLASS} {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 100% !important;
  margin: 0 !important;
  box-sizing: border-box !important;
  padding: 6px 12px !important;
  min-height: 34px !important;
  background: rgba(255, 255, 255, 0.04) !important;
  color: #e9e9e9 !important;
  text-decoration: none !important;
  font-weight: 500 !important;
  font-size: 14px !important;
  letter-spacing: 0.2px !important;
  border: 1px solid #3d454c !important;
  border-radius: 6px !important;
  user-select: none !important;
  text-shadow: none !important;
  box-shadow: none !important;
  transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease !important;
  cursor: pointer !important;
  -webkit-tap-highlight-color: transparent;
}
html body .mvProfileBanLegible a.${ACTION_CLASS}:hover,
html body .mvProfileBanLegible a.${ACTION_CLASS}:focus-visible {
  background: rgba(251, 133, 0, 0.1) !important;
  color: #e9e9e9 !important;
  border-color: #fb8500 !important;
  text-decoration: none !important;
  box-shadow: none !important;
}
html body .mvProfileBanLegible a.${ACTION_CLASS}:focus-visible {
  outline: 1px solid #fb8500 !important;
  outline-offset: 1px !important;
}
`
  parent.appendChild(el)
}

function isModActionLinkText(text: string): boolean {
  const t = text.trim().toLowerCase()
  return (
    t.includes('buscar clones') ||
    t.includes('levantar castigo') ||
    t.includes('modificar detalles de baneo') ||
    t.includes('modificar detalles')
  )
}

/** Enlaces de moderación: diseño de botón vía premium-styles.css */
function markActionButtonLinks(): void {
  const panel = document.querySelector<HTMLElement>(`.${BAN_CLASS}`)
  if (!panel) return
  for (const a of panel.querySelectorAll<HTMLAnchorElement>('a')) {
    if (a.classList.contains(ACTION_CLASS)) continue
    if (isModActionLinkText(a.textContent ?? '')) a.classList.add(ACTION_CLASS)
  }
}

/** Mueve botones a la columna derecha (tras crear layout) si seguían en el flujo de texto. */
function moveOrphanedActionsToColumn(panel: HTMLElement): void {
  const col = panel.querySelector<HTMLElement>('.mvProfileBanActions')
  if (!col) return
  for (const a of panel.querySelectorAll<HTMLAnchorElement>(`a.${ACTION_CLASS}`)) {
    if (!col.contains(a)) {
      col.appendChild(a)
    }
  }
}

/**
 * Un fila: texto a la izquierda, pila de botones a la derecha.
 */
function restructureBanPanelLayout(): void {
  const panel = document.querySelector<HTMLElement>(`.${BAN_CLASS}`)
  if (panel == null || panel.querySelector(`.${LAYOUT_CLASS}`) != null) return
  const actions = Array.from(panel.querySelectorAll<HTMLAnchorElement>(`a.${ACTION_CLASS}`))
  if (actions.length === 0) return
  const colActions = document.createElement('div')
  colActions.className = 'mvProfileBanActions'
  for (const a of actions) {
    colActions.appendChild(a)
  }
  const colText = document.createElement('div')
  colText.className = 'mvProfileBanText'
  while (panel.firstChild) {
    colText.appendChild(panel.firstChild)
  }
  const layout = document.createElement('div')
  layout.className = LAYOUT_CLASS
  layout.appendChild(colText)
  layout.appendChild(colActions)
  panel.appendChild(layout)
}

function syncBanPanelLayout(): void {
  ensureProfileBanActionStyles()
  markActionButtonLinks()
  restructureBanPanelLayout()
  const p = document.querySelector<HTMLElement>(`.${BAN_CLASS}`)
  if (p) moveOrphanedActionsToColumn(p)
  updateBodyProfileBanFlag()
}

function hasBanBlockText(text: string): boolean {
  if (!text.includes('Motivo de baneo')) return false
  return /Permaban|Autor del ban|baneo|castigo|clones|levantar|modificar detalles/i.test(text)
}

function isBlockLevelContainer(node: HTMLElement): boolean {
  return node.tagName === 'DIV' || node.tagName === 'SECTION' || node.tagName === 'ARTICLE'
}

function isBanContainerCandidate(p: HTMLElement, t: string): boolean {
  return isBlockLevelContainer(p) && hasBanBlockText(t) && t.length < 20_000 && t.length > 40
}

function collectAncestorsFromLink(a: HTMLAnchorElement, out: HTMLElement[]): void {
  let p: HTMLElement | null = a.parentElement
  for (let d = 0; d < 20 && p !== null; d += 1) {
    if (p === document.body) break
    const t = p.textContent ?? ''
    if (isBanContainerCandidate(p, t)) out.push(p)
    p = p.parentElement
  }
}

/**
 * Sube desde enlaces de moderación: el contenedor mínimo que sigue conteniendo el bloque
 * (evita anclar en #content entero).
 */
function findFromAdminLinks(): HTMLElement | null {
  const candidates: HTMLElement[] = []
  for (const a of document.querySelectorAll<HTMLAnchorElement>('a')) {
    if (!ANCHOR_LINK.test(a.textContent?.trim() ?? '')) continue
    collectAncestorsFromLink(a, candidates)
  }
  if (candidates.length === 0) return null
  candidates.sort((x, y) => (x.textContent?.length ?? 0) - (y.textContent?.length ?? 0))
  return candidates[0] ?? null
}

function findFromTextBlocks(): HTMLElement | null {
  const blocks = document.querySelectorAll<HTMLElement>('div, section, article, aside')
  let best: HTMLElement | null = null
  let bestLen = Number.POSITIVE_INFINITY
  for (const el of blocks) {
    if (el.classList.contains(BAN_CLASS)) continue
    const t = el.textContent ?? ''
    if (!hasBanBlockText(t)) continue
    if (t.length >= bestLen || t.length < 40) continue
    best = el
    bestLen = t.length
  }
  return best
}

function findBanPanel(): HTMLElement | null {
  return findFromAdminLinks() ?? findFromTextBlocks()
}

function markBanPanel(): void {
  const existing = document.querySelector<HTMLElement>(`.${BAN_CLASS}`)
  if (existing) {
    syncBanPanelLayout()
    return
  }
  const panel = findBanPanel()
  if (panel) {
    panel.classList.add(BAN_CLASS)
    syncBanPanelLayout()
    devLog.log('profile-ban-panel: contenedor de baneo resaltado')
  } else {
    updateBodyProfileBanFlag()
  }
}

function bootstrap(): void {
  ensureProfileBanActionStyles()
  markBanPanel()
  if (document.querySelector(`.${BAN_CLASS}`)) return
  let n = 0
  const t = window.setInterval(() => {
    n += 1
    markBanPanel()
    const found = document.querySelector(`.${BAN_CLASS}`) !== null
    if (found || n >= 25) {
      window.clearInterval(t)
    }
  }, 200)

  if (typeof MutationObserver === 'undefined') return
  const obs = new MutationObserver(() => {
    if (document.querySelector(`.${BAN_CLASS}`) === null) {
      markBanPanel()
    } else {
      syncBanPanelLayout()
    }
  })
  obs.observe(document.body, { childList: true, subtree: true })
  window.setTimeout(() => {
    obs.disconnect()
  }, 12_000)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap, { once: true })
} else {
  bootstrap()
}
