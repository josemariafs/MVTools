import { Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useMutatePostsConfig, usePostsConfig } from '@/entries/popup/components/sections/posts/hooks'

export const UserList = () => {
  const {
    data: { highlightedUsers }
  } = usePostsConfig()
  const { mutatePartial } = useMutatePostsConfig()

  const handleDelete = (user: string) => {
    const newHighlightedUsers = highlightedUsers.filter(highlightedUser => highlightedUser !== user)
    mutatePartial({ highlightedUsers: newHighlightedUsers })
  }

  if (!highlightedUsers.length) return null

  return (
    <ul className='space-y-1 pl-3 text-base font-semibold shadow-sm'>
      {highlightedUsers.map(user => (
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
