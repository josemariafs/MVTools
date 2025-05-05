import { useMutation } from '@tanstack/react-query'
import type { Table } from '@tanstack/react-table'
import { type MouseEvent, useCallback } from 'react'
import { toast } from 'sonner'

import { SearchInput } from '@/components/ui/search-input'
import { useMarkers } from '@/features/markers/hooks/use-markers'
import { RemoveItemsButton } from '@/features/shared/components/remove-items-button'
import { modifyBookmarkedPosts } from '@/services/media-vida'
import type { MarkerPost } from '@/types/media-vida'

interface Props {
  table: Table<MarkerPost>
}

export const TopControlPanel = ({ table }: Props) => {
  const { token } = useMarkers()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: modifyBookmarkedPosts,
    onError: error => {
      toast.error('No se han podido eliminar los marcadores', {
        description: error instanceof Error ? error.message : 'Error desconocido'
      })
    }
  })

  const handleDeleteClick = useCallback(
    async (e: MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()
      const selectedRows = table
        .getSelectedRowModel()
        .rows.map(({ original: { thread, post } }) => ({ threadId: thread.id, postId: post.id }))
      await mutateAsync({ items: selectedRows, action: 'remove', token })
      location.reload()
    },
    [table]
  )

  return (
    <div className='flex items-center justify-between'>
      <SearchInput
        className=' bg-[#39464c]'
        placeholder='Buscar marcadores...'
        value={table.getState().globalFilter ?? ''}
        onChange={table.setGlobalFilter}
        disabled={!table.getPreFilteredRowModel().rows.length}
      />
      <RemoveItemsButton
        className='text-sm'
        type='marcadores'
        disabled={!table.getSelectedRowModel().rows.length}
        onClick={handleDeleteClick}
        submitting={isPending}
      />
    </div>
  )
}
