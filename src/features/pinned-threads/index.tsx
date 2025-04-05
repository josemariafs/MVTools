import { useEffect, useMemo } from 'react'
import { toast } from 'sonner'

import type { ThreadListType } from '@/constants'
import { ActionButton } from '@/features/pinned-threads/components/action-button'
import { TableBodyRows } from '@/features/pinned-threads/components/table-body-rows'
import { TableHeaderCell } from '@/features/pinned-threads/components/table-header-cell'
import { defaultValues, useAppForm } from '@/features/pinned-threads/hooks/use-form'
import { PinnedThreadsProvider } from '@/features/pinned-threads/providers/pinned-threads-provider'
import { getFavoritesElements, getSectionFromType, removePinnedThreads } from '@/services/media-vida'

interface Props {
  type: ThreadListType
}

export const PinnedThreads = ({ type }: Props) => {
  const favoritesElements = useMemo(getFavoritesElements, [])
  const form = useAppForm({
    defaultValues,
    onSubmit: async ({ value: { items } }) => {
      try {
        await removePinnedThreads({ items, token: favoritesElements.token, fromSection: getSectionFromType(type) })
        location.reload()
      } catch (error) {
        toast.error(`No se han podido eliminar los hilos ${type}`, {
          description: error instanceof Error ? error.message : 'Error desconocido'
        })
      }
    }
  })

  useEffect(() => {
    favoritesElements.tableFooterRowCell.setAttribute('colspan', '7')
  }, [])

  return (
    <PinnedThreadsProvider
      type={type}
      {...favoritesElements}
    >
      <ActionButton form={form} />
      <TableHeaderCell form={form} />
      <TableBodyRows form={form} />
    </PinnedThreadsProvider>
  )
}
