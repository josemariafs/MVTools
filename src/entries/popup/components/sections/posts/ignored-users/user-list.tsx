import { Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useMutatePostsConfig, usePostsConfig } from '@/entries/popup/components/sections/posts/hooks'

export const UserList = () => {
  const {
    data: { ignoredUsers }
  } = usePostsConfig()
  const { mutatePartial } = useMutatePostsConfig()

  const handleDelete = (user: string) => {
    const newIgnoredUsers = ignoredUsers.filter(ignoredUser => ignoredUser !== user)
    mutatePartial({ ignoredUsers: newIgnoredUsers })
  }

  if (!ignoredUsers.length) return null

  return (
    <ul className='space-y-1 pl-3 text-base font-semibold shadow-sm'>
      {ignoredUsers.map(user => (
        <li
          key={user}
          className='ml-3 list-disc'
        >
          <div className='flex items-center justify-between'>
            {user}
            <Button
              size='icon'
              variant='ghost'
              className='size-7 text-red-800'
              type='button'
              onClick={() => {
                handleDelete(user)
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
