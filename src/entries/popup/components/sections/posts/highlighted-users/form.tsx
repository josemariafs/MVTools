import { Loader2, UserRoundPlus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Form as DefaultForm, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useHighlightedUsersForm } from '@/entries/popup/components/sections/posts/highlighted-users/hooks'
import type { HighlightedUsersFormData } from '@/entries/popup/components/sections/posts/highlighted-users/schema'
import { UserList } from '@/entries/popup/components/sections/posts/highlighted-users/user-list'
import { useMutatePostsConfig, usePostsConfig } from '@/entries/popup/components/sections/posts/hooks'

export const Form = () => {
  const form = useHighlightedUsersForm()
  const { data } = usePostsConfig()
  const { mutatePartial } = useMutatePostsConfig()

  const onSubmit = ({ highlightedUser }: HighlightedUsersFormData) => {
    mutatePartial({ highlightedUsers: [...data.highlightedUsers, highlightedUser] })
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
          name='highlightedUser'
          disabled={form.formState.isSubmitting}
          render={({ field }) => (
            <FormItem className='flex w-full gap-2 space-x-4 space-y-0'>
              <FormLabel className='min-w-fit pt-2.5'>Destacar usuario</FormLabel>
              <div className='w-full space-y-1.5'>
                <FormControl className='w-full'>
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
