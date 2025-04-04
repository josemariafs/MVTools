import { Trash2 } from 'lucide-react'
import type { Key, ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/utils/tailwind'

interface Props<T> {
  users: T[]
  onDelete: (user: T) => void
  getKey: (item: T) => Key
  renderItem: (item: T) => ReactNode
  itemClassName?: string
}

export const UserList = <T,>({ users, onDelete, getKey, itemClassName, renderItem }: Props<T>) => {
  if (!users.length) return null

  return (
    <ul className='space-y-1 pl-3 pr-1 text-base font-semibold shadow-sm'>
      {users.map(user => (
        <li
          key={getKey(user)}
          className={cn('ml-3 list-disc', itemClassName)}
        >
          <div className='flex items-center justify-between'>
            {renderItem(user)}
            <Button
              size='icon'
              variant='ghost'
              className='size-7 text-red-800'
              type='button'
              onClick={() => {
                onDelete(user)
              }}
            >
              <Trash2 />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  )
}
