import { createColumnHelper, type RowData } from '@tanstack/react-table'

import { Checkbox } from '@/components/ui/checkbox'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { MarkerPost } from '@/types/media-vida'

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Required for type inference
  interface TableMeta<TData extends RowData> {
    appRoot: HTMLElement
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Required for type inference
  interface ColumnMeta<TData extends RowData, TValue> {
    title?: boolean
    headerClassName?: string
    cellClassName?: string
  }
}

const columHelper = createColumnHelper<MarkerPost>()

export const columns = [
  columHelper.accessor('thread.title', {
    header: 'Hilo',
    cell: info => <a href={info.row.original.post.url}>{info.getValue()}</a>,
    meta: {
      cellClassName: 'max-w-32 truncate text-orange-500 font-semibold',
      title: true
    }
  }),
  columHelper.accessor('post.content', {
    id: 'postContent',
    header: 'Post',
    cell: info => (
      <Tooltip>
        <TooltipTrigger className='flex'>
          <div className='max-w-80 truncate'>{info.getValue()}</div>
        </TooltipTrigger>
        <TooltipContent
          container={info.table.options.meta?.appRoot}
          className='max-w-96 text-pretty text-sm'
          dark
        >
          {info.getValue()}
        </TooltipContent>
      </Tooltip>
    )
  }),
  columHelper.accessor('post.author.name', {
    header: 'Usuario',
    cell: info => <a href={info.row.original.post.author.url}>{info.getValue()}</a>,
    meta: {
      cellClassName: 'truncate max-w-24 font-semibold text-gray-400',
      title: true
    }
  }),
  columHelper.accessor('post.markedDate', {
    header: 'Fecha de marcado',
    meta: {
      headerClassName: 'text-nowrap'
    }
  }),
  columHelper.display({
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={value => {
          table.toggleAllPageRowsSelected(Boolean(value))
        }}
        disabled={!table.getRowModel().rows.length}
        aria-label='Seleccionar todos los hilos'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => {
          row.toggleSelected(Boolean(value))
        }}
        aria-label='Seleccionar hilo'
      />
    ),
    meta: {
      headerClassName: 'flex items-center justify-end mr-1.5',
      cellClassName: 'flex items-center justify-end mr-1.5'
    },
    enableSorting: false,
    enableHiding: false
  })
]
