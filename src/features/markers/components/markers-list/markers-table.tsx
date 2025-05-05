import { flexRender, type Table as ReactTableType } from '@tanstack/react-table'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { MarkerPost } from '@/types/media-vida'

interface Props {
  table: ReactTableType<MarkerPost>
}

export const MarkersTable = ({ table }: Props) => {
  return (
    <Table className='rounded-[3px] border border-b-[#1b1c1d] border-l-[#171819] border-r-[#30353a] border-t-[#262b31] bg-[#39464c]'>
      <TableHeader>
        {table.getHeaderGroups().map(headerGroup => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <TableHead
                key={header.id}
                className={header.column.columnDef.meta?.headerClassName}
              >
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map(row => (
          <TableRow
            key={row.id}
            data-state={row.getIsSelected() && 'selected'}
          >
            {row.getVisibleCells().map(cell => (
              <TableCell
                key={cell.id}
                className={cell.column.columnDef.meta?.cellClassName}
                title={cell.column.columnDef.meta?.title ? (cell.getValue() as string) : undefined}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
