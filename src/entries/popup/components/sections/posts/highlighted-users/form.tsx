import { Loader2, UserRoundPlus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Form as DefaultForm, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useHighlightedUsersForm } from '@/entries/popup/components/sections/posts/highlighted-users/hooks'
import type { HighlightedUsersFormData } from '@/entries/popup/components/sections/posts/highlighted-users/schema'
import { useMutatePostsConfig, usePostsConfig } from '@/entries/popup/components/sections/posts/hooks'
import { UserList } from '@/entries/popup/components/sections/posts/user-list'

export const Form = () => {
  const form = useHighlightedUsersForm()
  const { data } = usePostsConfig()
  const { mutatePartial } = useMutatePostsConfig()

  const onSubmit = ({ highlightedUser }: HighlightedUsersFormData) => {
    mutatePartial({ highlightedUsers: [...data.highlightedUsers, highlightedUser] })
    form.reset()
  }

  const handleDelete = (user: string) => {
    const newHighlightedUsers = data.highlightedUsers.filter(highlightedUser => highlightedUser !== user)
    mutatePartial({ highlightedUsers: newHighlightedUsers })
  }

  return (
    <DefaultForm {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='highlightedUser'
          disabled={form.formState.isSubmitting}
          render={({ field }) => (
            <FormItem className='flex w-full gap-2.5 space-y-0'>
              <FormLabel className='min-w-28 pt-2.5'>Destacar usuario</FormLabel>
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
                  users={data.highlightedUsers}
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
