import { Loader2, UserRoundPlus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Form as DefaultForm, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useMutatePostsConfig, usePostsConfig } from '@/entries/popup/components/sections/posts/hooks'
import { useIgnoredUsersForm } from '@/entries/popup/components/sections/posts/ignored-users/hooks'
import type { IgnoredUsersFormData } from '@/entries/popup/components/sections/posts/ignored-users/schema'
import { UserList } from '@/entries/popup/components/sections/posts/user-list'

export const Form = () => {
  const form = useIgnoredUsersForm()
  const { data } = usePostsConfig()
  const { mutatePartial } = useMutatePostsConfig()

  const handleSubmit = ({ ignoredUser }: IgnoredUsersFormData) => {
    mutatePartial({ ignoredUsers: [...data.ignoredUsers, ignoredUser] })
    form.reset()
  }

  const handleDelete = (user: string) => {
    const newIgnoredUsers = data.ignoredUsers.filter(ignoredUser => ignoredUser !== user)
    mutatePartial({ ignoredUsers: newIgnoredUsers })
  }

  return (
    <DefaultForm {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name='ignoredUser'
          disabled={form.formState.isSubmitting}
          render={({ field }) => (
            <FormItem className='flex w-full gap-2.5 space-y-0'>
              <FormLabel className='min-w-28 pt-2.5'>Ignorar usuario</FormLabel>
              <div className='w-full space-y-2'>
                <div className='flex w-full gap-2.5'>
                  <div className='w-full space-y-1'>
                    <FormControl className='w-full'>
                      <Input
                        {...field}
                        placeholder='Nick usuario'
                        autoComplete='off'
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                  <Button
                    className='min-w-9'
                    size='icon'
                    variant='outline'
                    type='submit'
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? <Loader2 className='animate-spin' /> : <UserRoundPlus />}
                  </Button>
                </div>
                <UserList
                  users={data.ignoredUsers}
                  getKey={username => username}
                  onDelete={handleDelete}
                  renderItem={username => username}
                />
              </div>
            </FormItem>
          )}
        />
      </form>
    </DefaultForm>
  )
}
