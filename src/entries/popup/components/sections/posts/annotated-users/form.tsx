import { Loader2, UserRoundPlus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Form as DefaultForm, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAnnotatedUsersForm } from '@/entries/popup/components/sections/posts/annotated-users/hooks'
import type { AnnotatedUsersFormData } from '@/entries/popup/components/sections/posts/annotated-users/schema'
import { UserList } from '@/entries/popup/components/sections/posts/annotated-users/user-list'
import { useMutatePostsConfig, usePostsConfig } from '@/entries/popup/components/sections/posts/hooks'

export const Form = () => {
  const form = useAnnotatedUsersForm()
  const { data } = usePostsConfig()
  const { mutatePartial } = useMutatePostsConfig()

  const onSubmit = (annotatedUser: AnnotatedUsersFormData) => {
    mutatePartial({ userNotes: [...data.userNotes, annotatedUser] })
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
          name='username'
          disabled={form.formState.isSubmitting}
          render={({ field }) => (
            <FormItem className='flex w-full gap-2 space-x-4 space-y-0'>
              <FormLabel className='pt-2.5'>Añadir notas a usuario</FormLabel>
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
        <FormField
          control={form.control}
          name='note'
          disabled={form.formState.isSubmitting}
          render={({ field }) => (
            <FormItem className='flex w-full gap-2 space-x-4 space-y-0'>
              <div className='w-full space-y-1.5'>
                <FormControl className='w-full'>
                  <Input
                    {...field}
                    placeholder='Notas'
                    autoComplete='off'
                  />
                </FormControl>
                <FormMessage className='max-w-52' />
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
