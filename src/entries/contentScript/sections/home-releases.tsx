import '@/entries/enableDevHmr'
import '@/entries/contentScript/content-script.css'

import { isMediavidaHomePathname } from '@/constants'
import { renderApp } from '@/entries/contentScript/utils/render'
import { CloneTrackingAlerts } from '@/features/clone-tracking-alerts'
import { GameReleasesCalendar } from '@/features/game-releases-calendar'
import { Portal } from '@/features/shared/components/portal'
import { devLog } from '@/utils/logging'
import { useEffect, useState } from 'react'

const CALENDAR_MOUNT_FLAG = 'data-mvtools-rawg-calendar-mounted'
const HOME_FEATURES_FLAG = 'data-mvtools-home-features'

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

function GameReleasesCalendarMount() {
  const [target, setTarget] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const tryFind = (): boolean => {
      const events = findUpcomingEventsBlock()
      if (!events || events.getAttribute(CALENDAR_MOUNT_FLAG) === '1') return Boolean(events)
      events.setAttribute(CALENDAR_MOUNT_FLAG, '1')
      setTarget(events)
      devLog.log('MVTools: calendario RAWG — anclaje sidebar', events.tagName)
      return true
    }

    if (tryFind()) return

    let attempts = 0
    const observer = new MutationObserver(() => {
      attempts += 1
      if (tryFind() || attempts > 40) {
        observer.disconnect()
        if (attempts > 40 && !findUpcomingEventsBlock()) {
          const fallback =
            document.querySelector<HTMLElement>('#cuerpo') ?? document.querySelector<HTMLElement>('#contenedor')
          if (fallback && fallback.getAttribute(CALENDAR_MOUNT_FLAG) !== '1') {
            fallback.setAttribute(CALENDAR_MOUNT_FLAG, '1')
            setTarget(fallback)
            devLog.log('MVTools: calendario RAWG — fallback', fallback.tagName)
          }
        }
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  if (!target) return null

  return (
    <Portal
      root={target}
      where='afterend'
      className='block w-full'
    >
      <GameReleasesCalendar />
    </Portal>
  )
}

function bootstrapHomeFeatures() {
  if (document.documentElement.getAttribute(HOME_FEATURES_FLAG) === '1') return
  document.documentElement.setAttribute(HOME_FEATURES_FLAG, '1')

  const host = document.createElement('div')
  host.hidden = true
  document.body.appendChild(host)

  renderApp(
    <>
      <GameReleasesCalendarMount />
      <CloneTrackingAlerts />
    </>,
    import.meta.PLUGIN_WEB_EXT_CHUNK_CSS_PATHS,
    { container: host }
  )
}

if (isMediavidaHomePathname(window.location.pathname)) {
  bootstrapHomeFeatures()
} else {
  devLog.log('MVTools: home-releases omitido (no es home)', window.location.pathname)
}
