import { RefreshCw } from 'lucide-react'
import type { MouseEvent } from 'react'
import { useCallback, useMemo, useState } from 'react'

import { URLS } from '@/constants'
import { ParentPlatformIcons } from '@/features/game-releases-calendar/parent-platform-icons'
import { useRawgUpcomingQuery } from '@/features/game-releases-calendar/use-rawg-upcoming-query'
import { setPendingJuegosThreadForGameId } from '@/services/pending-juegos-thread'
import type { FetchUpcomingReleasesResult } from '@/services/rawg'
import type { RawgGameListItem } from '@/types/rawg'
import { devLog } from '@/utils/logging'
import { cn } from '@/utils/tailwind'

const NEW_THREAD_PATH = '/foro/juegos/nuevo-hilo'

const ROW_MARK_STORAGE = 'mvtools-rawg-row-border'

/** Marca visual del borde izquierdo (10px); solo almacenamiento local, sin otra lógica. */
type RowBorderMark = 'none' | 'yellow' | 'green'

function readRowBorderMark(gameId: number): RowBorderMark {
  try {
    const raw = localStorage.getItem(`${ROW_MARK_STORAGE}:${gameId}`)
    if (raw === 'y' || raw === 'yellow') return 'yellow'
    if (raw === 'g' || raw === 'green') return 'green'
  } catch {
    /* ignore */
  }
  return 'none'
}

function writeRowBorderMark(gameId: number, m: RowBorderMark) {
  try {
    const k = `${ROW_MARK_STORAGE}:${gameId}`
    if (m === 'none') localStorage.removeItem(k)
    else if (m === 'yellow') localStorage.setItem(k, 'y')
    else localStorage.setItem(k, 'g')
  } catch {
    /* ignore */
  }
}

/** Color naranja MV (mismo del bloque "Próximos eventos"). */
const MV_ORANGE = '#f37b21'

/** Etiquetas en castellano para emular el formato nativo (ABR, MAY, …). */
const MONTH_SHORT_ES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'] as const
const WEEKDAY_SHORT_ES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'] as const

interface ParsedDay {
  monthShort: string
  day: string
  weekdayShort: string
}

function parseIsoDay(isoDay: string): ParsedDay | null {
  const [y, m, d] = isoDay.split('-').map(Number)
  if (!y || !m || !d) return null
  const date = new Date(y, m - 1, d)
  return {
    monthShort: MONTH_SHORT_ES[m - 1] ?? String(m).padStart(2, '0'),
    day: String(d).padStart(2, '0'),
    weekdayShort: WEEKDAY_SHORT_ES[date.getDay()] ?? ''
  }
}

interface FlatRow {
  isoDay: string
  parsed: ParsedDay | null
  game: RawgGameListItem
  /** True para la primera fila de cada día → en esa fila pintamos la tarjetita de fecha. */
  firstOfDay: boolean
}

function flattenRows(grouped: Map<string, RawgGameListItem[]>): FlatRow[] {
  const sortedDays = [...grouped.keys()].sort()
  const rows: FlatRow[] = []
  for (const isoDay of sortedDays) {
    const games = grouped.get(isoDay) ?? []
    const parsed = parseIsoDay(isoDay)
    games.forEach((game, index) => {
      rows.push({ isoDay, parsed, game, firstOfDay: index === 0 })
    })
  }
  return rows
}

function DateBadge({ parsed }: { parsed: ParsedDay | null }) {
  if (!parsed)
    return (
      <div
        className='w-9 shrink-0'
        aria-hidden
      />
    )
  return (
    <div
      className='w-9 shrink-0 select-none text-center leading-none'
      aria-label={`${parsed.weekdayShort} ${parsed.day} ${parsed.monthShort}`}
    >
      <div
        className='text-[10px] font-semibold uppercase tracking-wide'
        style={{ color: MV_ORANGE }}
      >
        {parsed.monthShort}
      </div>
      <div className='mt-0.5 text-[18px] font-bold leading-none text-zinc-100'>{parsed.day}</div>
    </div>
  )
}

function GameRow({ row, onGameClick }: { row: FlatRow; onGameClick: (g: RawgGameListItem) => void }) {
  const [borderMark, setBorderMark] = useState<RowBorderMark>(() => readRowBorderMark(row.game.id))

  const setYellow = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setBorderMark(cur => {
        const next: RowBorderMark = cur === 'yellow' ? 'none' : 'yellow'
        writeRowBorderMark(row.game.id, next)
        return next
      })
    },
    [row.game.id]
  )

  const setGreen = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setBorderMark(cur => {
        const next: RowBorderMark = cur === 'green' ? 'none' : 'green'
        writeRowBorderMark(row.game.id, next)
        return next
      })
    },
    [row.game.id]
  )

  /* inset evita chocar con border-t: `border-amber-400` en Tailwind colorea *todos* los lados
     y hacía que el separation border-t desapareciera / solo la 1.ª fila (sin border-t) viera el izquierdo bien. */
  const leftStripeShadow =
    borderMark === 'yellow' ? 'inset 10px 0 0 0 #fbbf24' : borderMark === 'green' ? 'inset 10px 0 0 0 #10b981' : undefined

  return (
    <li
      className='box-border flex items-center gap-2 border-t border-t-zinc-800/60 px-3 py-2 first:border-t-0 hover:bg-zinc-800/40 sm:gap-3'
      style={leftStripeShadow != null ? { boxShadow: leftStripeShadow } : undefined}
    >
      {row.firstOfDay ? (
        <DateBadge parsed={row.parsed} />
      ) : (
        <div
          className='w-9 shrink-0'
          aria-hidden
        />
      )}
      <button
        type='button'
        className='min-w-0 flex-1 truncate text-left text-[13px] font-medium leading-tight text-zinc-100 transition hover:text-orange-300'
        data-mvtools-rawg-id={String(row.game.id)}
        data-mvtools-rawg-name={row.game.name}
        title={row.game.name}
        onClick={() => {
          onGameClick(row.game)
        }}
      >
        {row.game.name}
      </button>
      <ParentPlatformIcons game={row.game} />
      <div className='flex shrink-0 items-center gap-0.5'>
        <button
          type='button'
          className={cn(
            'h-3.5 w-3.5 shrink-0 rounded-sm border border-amber-500/50 bg-amber-500/30 transition hover:bg-amber-500/50',
            borderMark === 'yellow' && 'ring-1 ring-amber-300 ring-offset-0 ring-offset-zinc-900'
          )}
          title='Hilo por crear (borde amarillo)'
          aria-label='Borde amarillo: hilo por crear'
          aria-pressed={borderMark === 'yellow'}
          onClick={setYellow}
        />
        <button
          type='button'
          className={cn(
            'h-3.5 w-3.5 shrink-0 rounded-sm border border-emerald-500/50 bg-emerald-500/30 transition hover:bg-emerald-500/50',
            borderMark === 'green' && 'ring-1 ring-emerald-300 ring-offset-0 ring-offset-zinc-900'
          )}
          title='Hilo creado (borde verde)'
          aria-label='Borde verde: hilo creado'
          aria-pressed={borderMark === 'green'}
          onClick={setGreen}
        />
      </div>
    </li>
  )
}

function StatusBlock({ data }: { data: FetchUpcomingReleasesResult }) {
  if (data.kind === 'no_key') {
    return (
      <p className='p-3 text-[12px] text-amber-300'>
        Añade tu clave de API de RAWG en el popup de MVTools (Configuración global) para ver el calendario.
      </p>
    )
  }
  if (data.kind === 'error') {
    return (
      <p
        className='p-3 text-[12px] text-red-400'
        role='alert'
      >
        {data.message}
      </p>
    )
  }
  if (data.games.length === 0) {
    return <p className='p-3 text-[12px] text-zinc-400'>RAWG no lista lanzamientos en este rango.</p>
  }
  return null
}

export const GameReleasesCalendar = () => {
  const { query, grouped, refresh, busy } = useRawgUpcomingQuery()
  const d = query.data
  const newThreadUrl = `${URLS.MEDIAVIDA}${NEW_THREAD_PATH}`

  const rows = useMemo(() => flattenRows(grouped), [grouped])

  const onGameClick = useCallback(
    async (game: RawgGameListItem) => {
      devLog.log('game-releases: abrir hilo juegos con borrador RAWG', game.id, game.name)
      try {
        await setPendingJuegosThreadForGameId(game.id)
      } catch (e) {
        devLog.error('setPendingJuegosThreadForGameId', e)
      }
      window.open(newThreadUrl, '_blank', 'noopener')
    },
    [newThreadUrl]
  )

  return (
    <aside className='mvts-rawg-calendar my-4 w-full max-w-full overflow-hidden rounded-sm border border-zinc-800 bg-zinc-900 text-left text-zinc-100 shadow-sm'>
      <header
        className='flex items-center justify-between gap-2 px-3 py-1.5 text-white'
        style={{ backgroundColor: MV_ORANGE }}
      >
        {/* Sin override de font-family ni de tamaño: heredamos del bloque hermano de
            "PRÓXIMOS EVENTOS" para que cabecera, peso y kerning coincidan exactamente. */}
        <h3 className='m-0 font-bold uppercase'>Próximos lanzamientos</h3>
        <button
          type='button'
          className='inline-flex size-6 items-center justify-center rounded-sm text-white/95 transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60'
          onClick={() => {
            void refresh()
          }}
          disabled={busy}
          aria-label='Actualizar lanzamientos (RAWG)'
          title='Actualizar (RAWG)'
        >
          <RefreshCw className={`size-3.5 ${busy ? 'animate-spin' : ''}`} />
        </button>
      </header>

      {query.isLoading && <p className='p-3 text-[12px] text-zinc-400'>Cargando…</p>}

      {d && <StatusBlock data={d} />}

      {d?.kind === 'ok' && d.games.length > 0 && (
        <>
          <ul className='divide-y divide-transparent'>
            {rows.map(row => (
              <GameRow
                key={`${row.isoDay}-${row.game.id}`}
                row={row}
                onGameClick={g => {
                  void onGameClick(g)
                }}
              />
            ))}
          </ul>
          <p
            className='border-t border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-right text-[10px] uppercase tracking-wide text-zinc-500'
            title={d.fromCache ? 'Datos en caché local (≤ 1 h).' : 'Datos recién obtenidos de RAWG.'}
          >
            {d.fromCache ? 'En caché' : 'Actualizado'} · 30 días · RAWG
          </p>
        </>
      )}
    </aside>
  )
}
