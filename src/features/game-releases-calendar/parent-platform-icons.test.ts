import { describe, expect, it } from 'vitest'

import { orderedParentSlugs } from '@/features/game-releases-calendar/parent-platform-icons'
import type { RawgGameListItem } from '@/types/rawg'

describe('orderedParentSlugs', () => {
  it('ordena y deduplica según la lista MV', () => {
    const g: RawgGameListItem = {
      id: 1,
      name: 'T',
      released: '2026-01-01',
      parent_platforms: [{ platform: { slug: 'nintendo' } }, { platform: { slug: 'pc' } }, { platform: { slug: 'playstation' } }]
    }
    expect(orderedParentSlugs(g)).toEqual(['playstation', 'nintendo', 'pc'])
  })
})
