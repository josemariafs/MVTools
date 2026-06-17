import { useEffect, useState } from 'react'

import { Portal } from '@/features/shared/components/portal'
import { checkAllTrackedCloneAccounts, type CloneBustedCheckResult } from '@/services/clone-tracking'
import { devLog } from '@/utils/logging'

const MV_ORANGE = '#f37b21'

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()
}

function findTopDiarioHeading(): HTMLElement | null {
  const headings = Array.from(document.querySelectorAll<HTMLElement>('h2, h3, h4'))
  return headings.find(heading => normalize(heading.textContent ?? '') === 'top diario') ?? null
}

export const CloneTrackingAlerts = () => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)
  const [alerts, setAlerts] = useState<CloneBustedCheckResult[]>([])

  useEffect(() => {
    const found = findTopDiarioHeading()
    if (found) {
      setAnchor(found)
      return
    }

    let attempts = 0
    const observer = new MutationObserver(() => {
      attempts += 1
      const heading = findTopDiarioHeading()
      if (heading) {
        setAnchor(heading)
        observer.disconnect()
        return
      }
      if (attempts > 40) observer.disconnect()
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let cancelled = false

    void (async () => {
      try {
        const results = await checkAllTrackedCloneAccounts()
        if (!cancelled) setAlerts(results)
      } catch (error) {
        devLog.log('clone-tracking: error comprobando cuentas en seguimiento', error)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  if (alerts.length === 0 || !anchor) return null

  return (
    <Portal
      root={anchor}
      where='beforebegin'
      className='block w-full'
    >
      <div className='mb-4 w-full rounded-sm border border-zinc-700 bg-zinc-900 px-4 py-3 text-[13px] leading-relaxed text-zinc-100 shadow-sm'>
        {alerts.map(alert => {
          const count = alert.nonBannedRows.length
          const label = count === 1 ? 'cuenta no baneada' : 'cuentas no baneadas'

          return (
            <p
              key={alert.userId}
              className='m-0'
            >
              <a
                href={alert.clonesUrl}
                className='font-semibold underline-offset-2 hover:underline'
                style={{ color: MV_ORANGE }}
              >
                {alert.username}
              </a>
              {': '}
              {count} {label}
            </p>
          )
        })}
      </div>
    </Portal>
  )
}
