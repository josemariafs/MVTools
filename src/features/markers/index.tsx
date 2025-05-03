import { useEffect, useMemo } from 'react'

import { ListToggle } from '@/features/markers/components/list-toggle'
import { MarkersList } from '@/features/markers/components/markers-list'
import { MarkersProvider } from '@/features/markers/providers/markers-provider'
import { useUserPreferences } from '@/features/shared/hooks/use-user-preferences'
import { getMarkersElements } from '@/services/media-vida'
import { toggleStyle } from '@/utils/dom'

export const Markers = () => {
  const markersElements = useMemo(getMarkersElements, [])
  const { markersListMode } = useUserPreferences()

  useEffect(() => {
    markersElements.postsContainer && toggleStyle(markersElements.postsContainer, markersListMode, { display: 'none' })
  }, [markersListMode])

  return (
    <MarkersProvider {...markersElements}>
      <ListToggle />
      <MarkersList />
    </MarkersProvider>
  )
}
