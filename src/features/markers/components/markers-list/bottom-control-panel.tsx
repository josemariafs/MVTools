import type { Table } from '@tanstack/react-table'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useMarkers } from '@/features/markers/hooks/use-markers'
import type { MarkerPost } from '@/types/media-vida'
import { cn } from '@/utils/tailwind'

interface Props {
  table: Table<MarkerPost>
}

export const BottomControlPanel = ({ table }: Props) => {
  const { bottomPanel } = useMarkers()

  return (
    <div className='flex items-center justify-end'>
      <div className='text-muted-foreground flex-1 pl-3 text-sm'>
        {table.getFilteredSelectedRowModel().rows.length} de {table.getFilteredRowModel().rows.length} post(s) seleccionados.
      </div>
      {bottomPanel?.hasPanel && (
        <div className='flex items-center gap-1'>
          {bottomPanel.prevButtonHref && (
            <Button
              asChild
              variant='outline'
              size='sm'
              className='rounded-[3px] bg-gray-500 p-2 text-white hover:bg-gray-600'
            >
              <a href={bottomPanel.prevButtonHref}>
                <ChevronLeft />
              </a>
            </Button>
          )}
          <ul className='flex items-center gap-1'>
            {bottomPanel.betweenButtons.map(({ href, text, isCurrent }) => (
              <li key={text}>
                <Button
                  asChild
                  variant='ghost'
                  size='sm'
                  className={cn([
                    'h-7 p-2 rounded-[3px] text-white hover:bg-gray-600',
                    'aria-disabled:hover:bg-transparent',
                    isCurrent && 'bg-gray-500 aria-disabled:hover:bg-gray-500'
                  ])}
                  aria-disabled={!href}
                >
                  {href ? <a href={href}>{text}</a> : <span>{text}</span>}
                </Button>
              </li>
            ))}
          </ul>
          {bottomPanel.nextButtonHref && (
            <Button
              asChild
              variant='outline'
              className='rounded-[3px] bg-orange-500 text-sm text-white hover:bg-orange-600'
              size='sm'
            >
              <a href={bottomPanel.nextButtonHref}>
                <ChevronRight /> Siguiente
              </a>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
