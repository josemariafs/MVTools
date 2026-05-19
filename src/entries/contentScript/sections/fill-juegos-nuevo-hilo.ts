import '@/entries/enableDevHmr'

import { CSS_SELECTORS } from '@/constants'
import { requestSteamAppDetails, requestSteamResolveFromRawgTitle } from '@/entries/background/steam-handlers'
import { requestSteamMirrorForImgbb } from '@/entries/background/steam-imgbb-client'
import { getGlobalConfig } from '@/services/config'
import { clearPendingJuegosThread, getPendingJuegosThread } from '@/services/pending-juegos-thread'
import { fetchRawgGameById, fetchRawgGameMovies, fetchRawgGameStoresUrls, fetchRawgGameYoutubeWatchUrl } from '@/services/rawg'
import type { RawgMovieItem } from '@/types/rawg'
import { buildJuegosThreadDraft, type ThreadDraft } from '@/services/rawg-thread-markdown'
import { rawgDetailFromSteamOnly } from '@/services/steam-to-rawg-detail'
import {
  extractSteamAppIdFromUrl,
  parseSteamAppIdFromInput,
  RAWG_STORE_ID,
  type SteamGameInfo
} from '@/services/steam-store'
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

async function steamWithImgbbWhenConfigured(steam: SteamGameInfo | null): Promise<SteamGameInfo | null> {
  if (!steam) return null
  const { imgbbApiKey } = await getGlobalConfig()
  if (!imgbbApiKey.trim()) return steam
  const r = await requestSteamMirrorForImgbb(steam)
  if (!r.ok) {
    devLog.log('fill-juegos ImgBB', r.error)
    return steam
  }
  return r.steam
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

async function fillFromPendingIfAny(): Promise<void> {
  const pending = await getPendingJuegosThread()
  if (!pending) {
    return
  }

  let draft: ThreadDraft | null = null
  try {
    const { rawgApiKey } = await getGlobalConfig()
    const detail = await fetchRawgGameById(rawgApiKey, pending.rawgGameId)

    const [moviesExtra, rawgYoutubeWatchUrl] = await Promise.all([
      detail.movies?.length ? Promise.resolve([] as RawgMovieItem[]) : fetchRawgGameMovies(rawgApiKey, pending.rawgGameId),
      fetchRawgGameYoutubeWatchUrl(rawgApiKey, pending.rawgGameId)
    ])
    const detailForDraft =
      !detail.movies?.length && moviesExtra.length > 0 ? { ...detail, movies: moviesExtra } : detail

    let storeUrls = await fetchRawgGameStoresUrls(rawgApiKey, pending.rawgGameId)

    let steam: SteamGameInfo | null = null
    const steamUrl = storeUrls[RAWG_STORE_ID.STEAM]
    let appId = extractSteamAppIdFromUrl(steamUrl)
    if (appId) {
      const r = await requestSteamAppDetails(appId)
      if (r.ok) {
        steam = r.info
      } else {
        devLog.log('fill-juegos-nuevo-hilo: Steam appdetails no disponible', r.error)
      }
    }
    if (!steam && detail.name.trim()) {
      const r = await requestSteamResolveFromRawgTitle(detail.name.trim())
      if (r.ok) {
        steam = r.info
        storeUrls = { ...storeUrls, [RAWG_STORE_ID.STEAM]: r.info.storeUrl }
      } else {
        devLog.log('fill-juegos-nuevo-hilo: Steam sin URL RAWG y resolve por título falló', r.error)
      }
    }

    if (steam) {
      steam = await steamWithImgbbWhenConfigured(steam)
    }

    draft = buildJuegosThreadDraft(detailForDraft, { storeUrls, steam, rawgYoutubeWatchUrl })
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

function mountSteamImportUi(): void {
  if (document.querySelector('[data-mvtools-steam-import-root]')) return

  const anchor = document.querySelector(TITLE)
  if (!anchor?.parentElement) return

  const root = document.createElement('div')
  root.dataset.mvtoolsSteamImportRoot = ''
  root.setAttribute(
    'style',
    [
      'margin-bottom:12px',
      'padding:10px 12px',
      'border:1px solid #ccd',
      'border-radius:6px',
      'background:#f8f9fb',
      'font-family:inherit',
      'font-size:13px'
    ].join(';')
  )

  const row = document.createElement('div')
  row.style.display = 'flex'
  row.style.flexWrap = 'wrap'
  row.style.gap = '8px'
  row.style.alignItems = 'center'

  const label = document.createElement('label')
  label.style.flex = '1 1 200px'
  label.style.display = 'flex'
  label.style.flexDirection = 'column'
  label.style.gap = '4px'
  label.style.margin = '0'
  const span = document.createElement('span')
  span.textContent = 'URL tienda Steam o AppID'
  span.style.fontWeight = '600'
  const input = document.createElement('input')
  input.type = 'text'
  input.placeholder = 'https://store.steampowered.com/app/730/…'
  input.autocomplete = 'off'
  input.style.width = '100%'
  input.style.boxSizing = 'border-box'
  input.style.padding = '6px 8px'
  label.append(span, input)

  const btn = document.createElement('button')
  btn.type = 'button'
  btn.textContent = 'Obtener from Steam'
  btn.style.padding = '8px 14px'
  btn.style.cursor = 'pointer'
  btn.style.whiteSpace = 'nowrap'

  const status = document.createElement('span')
  status.style.flex = '1 1 100%'
  status.style.fontSize = '12px'
  status.style.color = '#444'

  row.append(label, btn)
  root.append(row, status)

  anchor.parentElement.insertBefore(root, anchor)

  btn.addEventListener('click', async () => {
    const appId = parseSteamAppIdFromInput(input.value)
    if (appId == null) {
      status.textContent = 'Introduce una URL válida de store.steampowered.com/app/… o el número AppID.'
      status.style.color = '#a40'
      return
    }

    btn.disabled = true
    input.disabled = true
    status.style.color = '#444'
    status.textContent = 'Descargando datos de Steam…'

    try {
      const detailsRes = await requestSteamAppDetails(appId)
      if (!detailsRes.ok) {
        status.style.color = '#a40'
        status.textContent = detailsRes.error ?? 'No se pudo obtener la ficha Steam.'
        return
      }

      const { imgbbApiKey } = await getGlobalConfig()
      status.textContent = imgbbApiKey.trim()
        ? 'Convirtiendo y subiendo imágenes a ImgBB…'
        : 'Generando borrador con URLs directas de Steam (añade clave ImgBB en el popup para acortarlas).'

      let steamInfo = detailsRes.info
      steamInfo = (await steamWithImgbbWhenConfigured(steamInfo)) ?? steamInfo
      const detail = rawgDetailFromSteamOnly(steamInfo)
      const storeUrls: Record<number, string> = { [RAWG_STORE_ID.STEAM]: steamInfo.storeUrl }
      const draft = buildJuegosThreadDraft(detail, { storeUrls, steam: steamInfo })

      const ready = await waitForForm()
      if (!ready) {
        devLog.log('MVTools: timeout esperando formulario tras Steam')
      }

      if (!applyDraft(draft)) {
        status.style.color = '#a40'
        status.textContent = 'Datos listos pero no se encontró el formulario (#cabecera / #cuerpo).'
        try {
          await navigator.clipboard.writeText(`${draft.title}\n\n${draft.body}`)
          status.textContent += ' Borrador copiado al portapapeles.'
        } catch {
          /* ignore */
        }
        return
      }

      status.style.color = '#060'
      status.textContent = 'Hilo rellenado desde Steam. Revisa y publica cuando quieras.'
    } catch (e) {
      devLog.error('fill-juegos-nuevo-hilo Steam import', e)
      status.style.color = '#a40'
      status.textContent = 'Error inesperado; revisa la consola.'
    } finally {
      btn.disabled = false
      input.disabled = false
    }
  })
}

async function main(): Promise<void> {
  await fillFromPendingIfAny()
  const ok = await waitForForm()
  if (!ok) {
    devLog.log('MVTools: timeout esperando formulario para UI Steam')
  }
  mountSteamImportUi()
}

void main()
