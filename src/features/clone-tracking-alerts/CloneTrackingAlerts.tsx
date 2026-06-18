import { Loader2, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Portal } from '@/features/shared/components/portal'
import { usePreventDataScrollLocked } from '@/features/pinned-threads/hooks/use-prevent-data-scroll-locked'
import { useShadowRoot } from '@/features/shared/hooks/use-shadow-root'
import { checkTrackedCloneAccount, clonesPageUrl, getTrackedCloneAccounts, profilePageUrl, removeTrackedCloneAccount, type TrackedCloneAccount } from '@/services/clone-tracking'

const MV_ORANGE = '#f37b21'
const CLONE_TRACKING_DIALOG_POSITION = 'top-[max(5rem,12vh)] translate-y-0'
/** Por encima del AlertDialog (z-110) para que los tooltips del modal sean visibles. */
const CLONE_TRACKING_TOOLTIP_CLASS = 'z-[120] max-w-72 text-pretty border border-zinc-700 bg-zinc-900 text-zinc-100'

function AccountLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      className='font-semibold underline underline-offset-2 hover:text-orange-300'
      style={{ color: MV_ORANGE }}
    >
      {children}
    </a>
  )
}

function CloneTrackingSection({ children }: { children: ReactNode }) {
  return (
    <aside className='mb-4 w-full overflow-hidden rounded-sm border border-zinc-800 bg-zinc-900 text-left text-zinc-100 shadow-sm'>
      <header
        className='px-3 py-1.5 text-center text-white'
        style={{ backgroundColor: MV_ORANGE }}
      >
        <h3 className='m-0 font-bold uppercase'>Administración</h3>
      </header>
      <div className='px-4 py-3 text-[13px] leading-relaxed'>{children}</div>
    </aside>
  )
}

function CloneTrackingActionButton({
  children,
  onClick,
  className,
  disabled
}: {
  children: ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      className={`m-0 cursor-pointer border-0 bg-transparent p-0 text-[13px] font-semibold underline underline-offset-2 hover:text-orange-300 disabled:cursor-not-allowed disabled:opacity-70 ${className ?? ''}`}
      style={{ color: MV_ORANGE }}
    >
      {children}
    </button>
  )
}

type AccountExamineState =
  | { status: 'checking' }
  | { status: 'done'; cloneCount: number; cloneLabels: string[] }

function CloneCountLabel({
  label,
  cloneLabels,
  container
}: {
  label: string
  cloneLabels: string[]
  container: HTMLElement
}) {
  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <button
          type='button'
          className='shrink-0 cursor-default border-0 bg-transparent p-0 text-xs text-zinc-400 underline decoration-dotted underline-offset-2 hover:text-orange-300'
        >
          {label}
        </button>
      </TooltipTrigger>
      <TooltipContent
        container={container}
        side='bottom'
        align='start'
        dark
        className={CLONE_TRACKING_TOOLTIP_CLASS}
      >
        {cloneLabels.join(', ')}
      </TooltipContent>
    </Tooltip>
  )
}

function TrackedAccountsDialog() {
  const { appRoot } = useShadowRoot()
  const [open, setOpen] = useState(false)
  const [accounts, setAccounts] = useState<TrackedCloneAccount[]>([])
  const [loading, setLoading] = useState(false)
  const [examining, setExamining] = useState(false)
  const [examineByUserId, setExamineByUserId] = useState<Record<string, AccountExamineState>>({})
  const examineRequestId = useRef(0)
  usePreventDataScrollLocked(open)

  useEffect(() => {
    if (!open) {
      setExamineByUserId({})
      setExamining(false)
      return
    }

    let cancelled = false
    void (async () => {
      setLoading(true)
      try {
        const list = await getTrackedCloneAccounts()
        if (!cancelled) setAccounts(list)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [open])

  const handleRemove = async (userId: string) => {
    await removeTrackedCloneAccount(userId)
    setAccounts(prev => prev.filter(account => account.userId !== userId))
    setExamineByUserId(prev => {
      const next = { ...prev }
      delete next[userId]
      return next
    })
  }

  const runExamineAll = useCallback(() => {
    if (accounts.length === 0 || examining) return

    const requestId = ++examineRequestId.current
    setExamining(true)
    setExamineByUserId({})

    void (async () => {
      for (const account of accounts) {
        if (requestId !== examineRequestId.current) return

        setExamineByUserId(prev => ({ ...prev, [account.userId]: { status: 'checking' } }))

        try {
          const result = await checkTrackedCloneAccount(account)
          const cloneLabels = result?.nonBannedRows.map(row => row.label) ?? []
          const cloneCount = cloneLabels.length
          if (requestId !== examineRequestId.current) return
          setExamineByUserId(prev => ({ ...prev, [account.userId]: { status: 'done', cloneCount, cloneLabels } }))
        } catch {
          if (requestId !== examineRequestId.current) return
          setExamineByUserId(prev => ({ ...prev, [account.userId]: { status: 'done', cloneCount: 0, cloneLabels: [] } }))
        }
      }

      if (requestId === examineRequestId.current) setExamining(false)
    })()
  }, [accounts, examining])

  return (
    <AlertDialog
      open={open}
      onOpenChange={setOpen}
    >
      <AlertDialogTrigger asChild>
        <CloneTrackingActionButton>Usuarios en seguimiento</CloneTrackingActionButton>
      </AlertDialogTrigger>
      <AlertDialogContent
        container={appRoot}
        className={CLONE_TRACKING_DIALOG_POSITION}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>Usuarios en seguimiento</AlertDialogTitle>
          <AlertDialogDescription className='sr-only'>
            Lista de cuentas con seguimiento de clones activo. Puedes quitarlas desde aquí.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {loading ? (
          <p className='m-0 text-sm text-muted-foreground'>Cargando…</p>
        ) : accounts.length === 0 ? (
          <p className='m-0 text-sm text-muted-foreground'>
            No hay usuarios en seguimiento. Añádelos desde la página de clones de cada cuenta.
          </p>
        ) : (
          <div>
            <style>{`
              .mv-clones-tracked-list {
                scrollbar-width: thin;
                scrollbar-color: ${MV_ORANGE} #27272a;
              }
              .mv-clones-tracked-list::-webkit-scrollbar {
                width: 5px;
              }
              .mv-clones-tracked-list::-webkit-scrollbar-track {
                background: #27272a;
                border-radius: 3px;
              }
              .mv-clones-tracked-list::-webkit-scrollbar-thumb {
                background: ${MV_ORANGE};
                border-radius: 3px;
              }
              .mv-clones-tracked-list::-webkit-scrollbar-thumb:hover {
                background: #ffa300;
              }
            `}</style>
            <ul className='mv-clones-tracked-list m-0 max-h-[26rem] list-none space-y-2 overflow-y-auto p-0 pr-3 text-left text-sm text-foreground'>
              {accounts.map(account => {
                const examineState = examineByUserId[account.userId]
                const cloneLabel =
                  examineState?.status === 'done' && examineState.cloneCount > 0
                    ? examineState.cloneCount === 1
                      ? '1 clon'
                      : `${examineState.cloneCount} clones`
                    : null

                return (
                  <li
                    key={account.userId}
                    className='flex items-center justify-between gap-3'
                  >
                    <span className='flex min-w-0 flex-1 items-center gap-2'>
                      <span
                        className='flex size-4 shrink-0 items-center justify-center'
                        aria-hidden={examineState?.status !== 'checking'}
                      >
                        {examineState?.status === 'checking' ? (
                          <Loader2
                            className='size-3.5 animate-spin'
                            style={{ color: MV_ORANGE }}
                            aria-label={`Examinando a ${account.username}`}
                          />
                        ) : null}
                      </span>
                      <AccountLink href={profilePageUrl(account.userId)}>{account.username}</AccountLink>
                      {cloneLabel && examineState?.status === 'done' ? (
                        <CloneCountLabel
                          label={cloneLabel}
                          cloneLabels={examineState.cloneLabels}
                          container={appRoot}
                        />
                      ) : null}
                    </span>
                    <span className='mr-1 flex shrink-0 items-center gap-2'>
                      <a
                        href={clonesPageUrl(account.userId)}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-xs text-muted-foreground underline underline-offset-2 hover:text-orange-300'
                      >
                        Clones
                      </a>
                      <Tooltip delayDuration={200}>
                        <TooltipTrigger asChild>
                          <button
                            type='button'
                            onClick={() => {
                              void handleRemove(account.userId)
                            }}
                            disabled={examining}
                            className='inline-flex size-6 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent text-red-400 transition hover:bg-red-950/40 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50'
                            aria-label={`Quitar a ${account.username} del seguimiento`}
                          >
                            <Trash2 className='size-3.5' />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent
                          container={appRoot}
                          side='left'
                          dark
                          className={CLONE_TRACKING_TOOLTIP_CLASS}
                        >
                          Quitar del seguimiento
                        </TooltipContent>
                      </Tooltip>
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
        <AlertDialogFooter className={accounts.length > 0 && !loading ? 'sm:justify-between' : undefined}>
          {accounts.length > 0 && !loading ? (
            <Button
              type='button'
              onClick={runExamineAll}
              disabled={examining}
              className='h-9 rounded-sm border-0 px-4 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50'
              style={{ backgroundColor: MV_ORANGE }}
            >
              {examining ? 'Buscando clones…' : 'Buscar clones en seguimiento'}
            </Button>
          ) : null}
          <AlertDialogCancel>Cerrar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

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

  if (!anchor) return null

  return (
    <Portal
      root={anchor}
      where='beforebegin'
      className='block w-full'
    >
      <CloneTrackingSection>
        <TrackedAccountsDialog />
      </CloneTrackingSection>
    </Portal>
  )
}
