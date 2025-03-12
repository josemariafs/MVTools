import { Loader2, UserRoundPlus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Form as DefaultForm, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useMutatePostsConfig, usePostsConfig } from '@/entries/popup/components/sections/posts/hooks'
import { useIgnoredUsersForm } from '@/entries/popup/components/sections/posts/ignored-users/hooks'
import type { IgnoredUsersFormData } from '@/entries/popup/components/sections/posts/ignored-users/schema'
import { UserList } from '@/entries/popup/components/sections/posts/ignored-users/user-list'

export const Form = () => {
  const form = useIgnoredUsersForm()
  const { data } = usePostsConfig()
  const { mutatePartial } = useMutatePostsConfig()

  const onSubmit = ({ ignoredUser }: IgnoredUsersFormData) => {
    mutatePartial({ ignoredUsers: [...data.ignoredUsers, ignoredUser] })
    form.reset()
  }

  return (
    <DefaultForm {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex w-full gap-2'
      >
        <FormField
          control={form.control}
          name='ignoredUser'
          disabled={form.formState.isSubmitting}
          render={({ field }) => (
            <FormItem className='flex w-full gap-2 space-x-4 space-y-0'>
              <FormLabel className='pt-2.5'>Ignorar usuario</FormLabel>
              <div className='space-y-1.5'>
                <FormControl className='min-w-[14.6rem]'>
                  <Input
                    {...field}
                    placeholder='Nick usuario'
                    autoComplete='off'
                  />
                </FormControl>
                <FormMessage className='max-w-52' />
                <UserList />
              </div>
            </FormItem>
          )}
        />
        <Button
          size='icon'
          variant='outline'
          type='submit'
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? <Loader2 className='animate-spin' /> : <UserRoundPlus />}
        </Button>
      </form>
    </DefaultForm>
  )
}
