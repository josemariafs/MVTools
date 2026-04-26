import '@/entries/enableDevHmr'
import '@/entries/contentScript/content-script.css'

import { isMediavidaHomePathname } from '@/constants'
import { renderApp } from '@/entries/contentScript/utils/render'
import { GameReleasesCalendar } from '@/features/game-releases-calendar'
import { devLog } from '@/utils/logging'

const MOUNT_FLAG = 'data-mvtools-rawg-calendar-mounted'

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()
}

/** Devuelve el contenedor del bloque "Próximos eventos" (su padre directo en la sidebar). */
function findUpcomingEventsBlock(): HTMLElement | null {
  const headings = Array.from(document.querySelectorAll<HTMLElement>('h3, h2, h4'))
  const heading = headings.find(h => normalize(h.textContent ?? '') === 'proximos eventos')
  if (!heading) return null
  return heading.closest('section, aside, .widget, .box, div') ?? heading.parentElement
}

function mountCalendar(target: HTMLElement, where: 'afterend' | 'beforeend' | 'afterbegin') {
  if (target.getAttribute(MOUNT_FLAG) === '1') return
  target.setAttribute(MOUNT_FLAG, '1')
  devLog.log('MVTools: calendario RAWG — montaje', { where, target: target.tagName + (target.id ? `#${target.id}` : '') })
  renderApp(<GameReleasesCalendar />, import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS, { container: target, where })
}

function tryMount(): boolean {
  const events = findUpcomingEventsBlock()
  if (events) {
    mountCalendar(events, 'afterend')
    return true
  }
  return false
}

if (isMediavidaHomePathname(window.location.pathname)) {
  if (!tryMount()) {
    let attempts = 0
    const observer = new MutationObserver(() => {
      attempts++
      if (tryMount() || attempts > 40) {
        observer.disconnect()
        if (attempts > 40) {
          const fallback =
            document.querySelector<HTMLElement>('#cuerpo') ?? document.querySelector<HTMLElement>('#contenedor') ?? document.body
          devLog.log('MVTools: calendario RAWG — no se encontró "Próximos eventos", fallback', fallback.tagName)
          mountCalendar(fallback, 'afterbegin')
        }
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })
  }
} else {
  devLog.log('MVTools: home-releases omitido (no es home)', window.location.pathname)
}
