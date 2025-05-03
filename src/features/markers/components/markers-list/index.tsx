import { getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table'

import { BottomControlPanel } from '@/features/markers/components/markers-list/bottom-control-panel'
import { MarkersTable } from '@/features/markers/components/markers-list/markers-table'
import { columns } from '@/features/markers/components/markers-list/table-data'
import { TopControlPanel } from '@/features/markers/components/markers-list/top-control-panel'
import { useMarkers } from '@/features/markers/hooks/useMarkers'
import { Portal } from '@/features/shared/components/portal'
import { useShadowRoot } from '@/features/shared/hooks/use-shadow-root'
import { useUserPreferences } from '@/features/shared/hooks/use-user-preferences'

export const MarkersList = () => {
  const { markersListMode } = useUserPreferences()
  const { postsContainer, posts } = useMarkers()
  const { appRoot } = useShadowRoot()
  const table = useReactTable({
    data: posts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    meta: { appRoot }
  })

  return (
    <Portal root={postsContainer?.parentElement}>
      {markersListMode && (
        <section className='space-y-2'>
          <TopControlPanel table={table} />
          <MarkersTable table={table} />
          <BottomControlPanel table={table} />
        </section>
      )}
    </Portal>
  )
}
