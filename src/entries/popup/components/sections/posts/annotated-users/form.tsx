import { Loader2, UserRoundPlus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Form as DefaultForm, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useAnnotatedUsersForm } from '@/entries/popup/components/sections/posts/annotated-users/hooks'
import type { AnnotatedUsersFormData } from '@/entries/popup/components/sections/posts/annotated-users/schema'
import { useMutatePostsConfig, usePostsConfig } from '@/entries/popup/components/sections/posts/hooks'
import { UserList } from '@/entries/popup/components/sections/posts/user-list'
import { cn } from '@/utils/tailwind'

export const Form = () => {
  const form = useAnnotatedUsersForm()
  const { data } = usePostsConfig()
  const { mutatePartial } = useMutatePostsConfig()

  const handleSubmit = (annotatedUser: AnnotatedUsersFormData) => {
    mutatePartial({ userNotes: [...data.userNotes, annotatedUser] })
    form.reset()
  }

  const handleDelete = (item: AnnotatedUsersFormData) => {
    const userNotes = data.userNotes.filter(({ username }) => username !== item.username)
    mutatePartial({ userNotes })
  }

  return (
    <DefaultForm {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className='flex gap-2'
      >
        <Label
          className={cn('min-w-28 pt-1', Object.keys(form.formState.errors).length && 'text-destructive')}
          htmlFor='username'
        >
          Añadir notas a usuario
        </Label>
        <div className='w-full space-y-2'>
          <div className='flex w-full gap-2.5'>
            <div className='flex w-full gap-2'>
              <FormField
                control={form.control}
                name='username'
                disabled={form.formState.isSubmitting}
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormControl className='w-full'>
                      <Input
                        {...field}
                        placeholder='Nick usuario'
                        autoComplete='off'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='note'
                disabled={form.formState.isSubmitting}
                render={({ field }) => (
                  <FormItem className='w-full'>
                    <FormControl className='w-full'>
                      <Input
                        {...field}
                        placeholder='Notas'
                        autoComplete='off'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
            users={data.userNotes}
            getKey={item => item.username}
            onDelete={handleDelete}
            renderItem={item => (
              <div className='flex w-full justify-between pr-3'>
                <span>{item.username}</span>
                <Tooltip>
                  <TooltipTrigger className='w-full max-w-28 truncate'>{item.note}</TooltipTrigger>
                  <TooltipContent className='w-48 text-balance text-left'>{item.note}</TooltipContent>
                </Tooltip>
              </div>
            )}
          />
        </div>
      </form>
    </DefaultForm>
  )
}
