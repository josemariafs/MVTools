import { GitCommitVertical, Trash2 } from 'lucide-react'
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
    <ul className='relative space-y-1 pl-3 pr-1 text-base font-semibold shadow-sm'>
      {users.map(user => (
        <li
          key={getKey(user)}
          className={cn('flex items-center justify-between', itemClassName)}
        >
          <GitCommitVertical
            className='absolute -left-1 mt-px'
            size={16}
          />
          {renderItem(user)}
          <Button
            size='icon'
            variant='ghost'
            className='size-7 pt-px text-red-800'
            type='button'
            onClick={() => {
              onDelete(user)
            }}
          >
            <Trash2 />
          </Button>
        </li>
      ))}
    </ul>
  )
}
