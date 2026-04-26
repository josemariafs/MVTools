import '@/entries/enableDevHmr'

import { CSS_SELECTORS } from '@/constants'
import { requestSteamAppDetails } from '@/entries/background/steam-handlers'
import { getGlobalConfig } from '@/services/config'
import { clearPendingJuegosThread, getPendingJuegosThread } from '@/services/pending-juegos-thread'
import { fetchRawgGameById, fetchRawgGameStoresUrls } from '@/services/rawg'
import { buildJuegosThreadDraft, type ThreadDraft } from '@/services/rawg-thread-markdown'
import { extractSteamAppIdFromUrl, RAWG_STORE_ID, type SteamGameInfo } from '@/services/steam-store'
import { devLog } from '@/utils/logging'

const { TITLE, DESCRIPTION, CATEGORY } = CSS_SELECTORS.NEW_THREAD

const MAX_TRIES = 20
const RETRY_MS = 150

function setFieldValue(el: HTMLInputElement | HTMLTextAreaElement, value: string) {
  el.value = value
  el.dispatchEvent(new Event('input', { bubbles: true }))
  el.dispatchEvent(new Event('change', { bubbles: true }))
}

function setSelectByOptionLabel(select: HTMLSelectElement, label: string): boolean {
  const want = label.trim().toLowerCase()
  for (let i = 0; i < select.options.length; i++) {
    const opt = select.options[i]!
    const t = opt.textContent?.trim().toLowerCase() ?? ''
    if (t === want) {
      select.selectedIndex = i
      select.value = opt.value
      select.dispatchEvent(new Event('input', { bubbles: true }))
      select.dispatchEvent(new Event('change', { bubbles: true }))
      return true
    }
  }
  return false
}

function applyDraft(draft: ThreadDraft): boolean {
  const titleEl = document.querySelector<HTMLInputElement>(TITLE)
  const bodyEl = document.querySelector<HTMLTextAreaElement>(DESCRIPTION) ?? document.querySelector<HTMLInputElement>(DESCRIPTION)
  if (!titleEl || !bodyEl) {
    return false
  }
  setFieldValue(titleEl, draft.title)
  setFieldValue(bodyEl, draft.body)

  const tagEl = document.querySelector<HTMLSelectElement>(CATEGORY)
  if (tagEl && draft.category) {
    const ok = setSelectByOptionLabel(tagEl, draft.category)
    if (!ok) {
      devLog.log('MVTools: no se encontró la categoría en <select#tag>:', draft.category)
    }
  }
  return true
}

async function waitForForm(): Promise<boolean> {
  for (let i = 0; i < MAX_TRIES; i++) {
    if (document.querySelector(TITLE) && document.querySelector(DESCRIPTION)) {
      return true
    }
    // eslint-disable-next-line promise/avoid-new -- espera breve hasta que exista el formulario
    await new Promise<void>(resolve => {
      setTimeout(resolve, RETRY_MS)
    })
  }
  return false
}

async function run(): Promise<void> {
  const pending = await getPendingJuegosThread()
  if (!pending) {
    return
  }

  let draft: ThreadDraft | null = null
  try {
    const { rawgApiKey } = await getGlobalConfig()
    const detail = await fetchRawgGameById(rawgApiKey, pending.rawgGameId)

    // Resolver URLs reales de tienda (RAWG anidado) en paralelo con el detalle ya tenemos.
    const storeUrls = await fetchRawgGameStoresUrls(rawgApiKey, pending.rawgGameId)

    // Si hay tienda Steam, intentamos enriquecer (capturas + descripción ES).
    let steam: SteamGameInfo | null = null
    const steamUrl = storeUrls[RAWG_STORE_ID.STEAM]
    const appId = extractSteamAppIdFromUrl(steamUrl)
    if (appId) {
      const r = await requestSteamAppDetails(appId)
      if (r.ok) {
        steam = r.info
      } else {
        devLog.log('fill-juegos-nuevo-hilo: Steam appdetails no disponible', r.error)
      }
    }

    draft = buildJuegosThreadDraft(detail, { storeUrls, steam })
  } catch (e) {
    devLog.error('fill-juegos-nuevo-hilo', e)
    await clearPendingJuegosThread()
    return
  }

  const ready = await waitForForm()
  if (!ready) {
    devLog.log('MVTools: timeout esperando #cabecera / #cuerpo')
  }

  if (!applyDraft(draft)) {
    const hint = 'No se pudo rellenar el formulario; cuerpo generado (revisa consola / portapapeles):'
    const blob = `${draft.title}\n\n${draft.body}`
    try {
      await navigator.clipboard.writeText(blob)
      devLog.log('MVTools:', hint, 'Contenido copiado al portapapeles.')
    } catch {
      devLog.log('MVTools:', hint, blob.slice(0, 500))
    }
  }

  await clearPendingJuegosThread()
}

void run()
