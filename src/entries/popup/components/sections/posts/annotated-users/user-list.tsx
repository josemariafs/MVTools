import { Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useMutatePostsConfig, usePostsConfig } from '@/entries/popup/components/sections/posts/hooks'

export const UserList = () => {
  const {
    data: { userNotes }
  } = usePostsConfig()
  const { mutatePartial } = useMutatePostsConfig()

  const handleDelete = (user: string) => {
    const annotatedUser = userNotes.filter(({ username }) => username !== user)
    mutatePartial({ userNotes: annotatedUser })
  }

  if (!userNotes.length) return null

  return (
    <ul className='space-y-1 pl-3 text-base font-semibold shadow-sm'>
      {userNotes.map(user => (
        <li
          key={user.username}
          className='ml-3 list-disc'
        >
          <div className='flex items-center justify-between gap-3'>
            <span>{user.username}</span>
            <span>{user.note}</span>
            <Button
              size='icon'
              variant='ghost'
              className='size-7 text-red-800'
              type='button'
              onClick={() => {
                handleDelete(user.username)
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
