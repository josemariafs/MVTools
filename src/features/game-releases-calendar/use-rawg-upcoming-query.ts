import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState } from 'react'
import browser from 'webextension-polyfill'

import { getGlobalConfig } from '@/services/config'
import { fetchUpcomingReleases, groupGamesByReleaseDate, RAWG_UPCOMING_CACHE_TTL_MS } from '@/services/rawg'
import type { RawgGameListItem } from '@/types/rawg'

export const rawgUpcomingQueryKey = ['rawg-upcoming'] as const

export const useRawgUpcomingQuery = () => {
  const queryClient = useQueryClient()
  const [manualLoading, setManualLoading] = useState(false)

  const query = useQuery({
    queryKey: rawgUpcomingQueryKey,
    staleTime: RAWG_UPCOMING_CACHE_TTL_MS,
    queryFn: async () => {
      const { rawgApiKey } = await getGlobalConfig()
      return await fetchUpcomingReleases(rawgApiKey, { forceRefresh: false })
    }
  })

  const grouped = useMemo(() => {
    if (query.data?.kind !== 'ok') return new Map<string, RawgGameListItem[]>()
    return groupGamesByReleaseDate(query.data.games)
  }, [query.data])

  const refresh = useCallback(async () => {
    setManualLoading(true)
    try {
      const { rawgApiKey } = await getGlobalConfig()
      const res = await fetchUpcomingReleases(rawgApiKey, { forceRefresh: true })
      queryClient.setQueryData(rawgUpcomingQueryKey, res)
    } finally {
      setManualLoading(false)
    }
  }, [queryClient])

  const busy = query.isFetching || manualLoading

  useEffect(() => {
    if (query.data?.kind === 'ok') {
      void browser.runtime.sendMessage('mvtools-rawg-cache-updated').catch(() => {})
    }
  }, [query.data])

  return { query, grouped, refresh, busy }
}
