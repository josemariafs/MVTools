import { Gamepad2, Globe, Monitor } from 'lucide-react'
import { type ReactNode, useMemo } from 'react'
import { siAndroid, siApple, siAppstore, siEpicgames, siGogdotcom, siLinux, type SimpleIcon, siPlaystation, siSteam } from 'simple-icons'

import type { RawgGameListItem } from '@/types/rawg'

const ORDER = ['playstation', 'xbox', 'nintendo', 'pc', 'mac', 'linux', 'android', 'ios', 'web', 'steam', 'gog', 'epic'] as const

const ORDER_SET = new Set<string>(ORDER)

const SI_BY_SLUG: Record<string, SimpleIcon> = {
  steam: siSteam,
  gog: siGogdotcom,
  epic: siEpicgames
}

function normKey(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function orderedParentSlugs(game: RawgGameListItem): string[] {
  const list = game.parent_platforms ?? []
  const set = new Set<string>()
  for (const p of list) {
    const s = p.platform?.slug
    if (s) set.add(s.toLowerCase())
  }
  const head = (ORDER as readonly string[]).filter(s => set.has(s))
  const rest = [...set].filter(s => !ORDER_SET.has(s)).sort()
  return [...head, ...rest]
}

function SimpleIconGlyph({ icon }: { icon: SimpleIcon }) {
  return (
    <svg
      className='size-3.5 shrink-0'
      viewBox='0 0 24 24'
      role='img'
    >
      <title>{icon.title}</title>
      <path
        d={icon.path}
        fill='currentColor'
        className='text-zinc-500'
      />
    </svg>
  )
}

/** Xbox ya no figura en simple-icons: disco verde con X blanca. */
function XboxGlyph() {
  return (
    <svg
      className='size-3.5 shrink-0'
      viewBox='0 0 24 24'
      role='img'
      aria-hidden
    >
      <title>Xbox</title>
      <circle
        cx='12'
        cy='12'
        r='8'
        fill='#107C10'
      />
      <path
        d='M9 9l6 6M15 9l-6 6'
        stroke='white'
        strokeWidth='1.7'
        strokeLinecap='round'
        fill='none'
      />
    </svg>
  )
}

/** Mando estilo Switch (dos mitades). */
function NintendoGlyph() {
  return (
    <svg
      className='size-3.5 shrink-0'
      viewBox='0 0 24 24'
      role='img'
      aria-hidden
    >
      <title>Nintendo</title>
      <rect
        x='3.5'
        y='5'
        width='6.2'
        height='14'
        rx='1.3'
        fill='#3B89F7'
      />
      <rect
        x='14.3'
        y='5'
        width='6.2'
        height='14'
        rx='1.3'
        fill='#E60012'
      />
    </svg>
  )
}

function webSlug(slug: string): boolean {
  return slug === 'web' || slug.includes('web')
}

function renderIconForSlug(slug: string): ReactNode {
  if (webSlug(slug)) {
    return (
      <Globe
        className='size-3.5 shrink-0 text-zinc-500'
        aria-hidden
      />
    )
  }
  switch (slug) {
    case 'pc':
      return (
        <Monitor
          className='size-3.5 shrink-0 text-zinc-500'
          aria-hidden
        />
      )
    case 'playstation':
      return <SimpleIconGlyph icon={siPlaystation} />
    case 'xbox':
      return <XboxGlyph />
    case 'nintendo':
      return <NintendoGlyph />
    case 'mac':
      return <SimpleIconGlyph icon={siApple} />
    case 'linux':
      return <SimpleIconGlyph icon={siLinux} />
    case 'android':
      return <SimpleIconGlyph icon={siAndroid} />
    case 'ios':
      return <SimpleIconGlyph icon={siAppstore} />
    default: {
      const direct = SI_BY_SLUG[slug] ?? SI_BY_SLUG[normKey(slug)]
      if (direct) return <SimpleIconGlyph icon={direct} />
      return (
        <Gamepad2
          className='size-3 shrink-0 text-zinc-600'
          aria-hidden
        />
      )
    }
  }
}

export function ParentPlatformIcons({ game }: { game: RawgGameListItem }) {
  const slugs = useMemo(() => orderedParentSlugs(game), [game])
  if (slugs.length === 0) {
    return (
      <Gamepad2
        className='size-3.5 shrink-0 text-zinc-600'
        aria-hidden
      />
    )
  }

  return (
    <div
      className='flex min-w-0 max-w-[6.5rem] shrink-0 flex-wrap items-center justify-end gap-0.5'
      title={slugs.join(' · ')}
    >
      {slugs.map(s => (
        <span
          key={s}
          className='inline-flex items-center'
        >
          {renderIconForSlug(s)}
        </span>
      ))}
    </div>
  )
}
