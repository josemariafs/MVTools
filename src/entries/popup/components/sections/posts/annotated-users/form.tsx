import { Loader2, UserRoundPlus } from 'lucide-react'
import { type FormEvent, useCallback } from 'react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useAnnotatedUsersForm } from '@/entries/popup/components/sections/posts/annotated-users/hooks'
import { useMutatePostsConfig, usePostsConfig } from '@/entries/popup/components/sections/posts/hooks'
import { UserList } from '@/entries/popup/components/sections/posts/user-list'
import type { UserNote } from '@/services/config'
import { cn } from '@/utils/tailwind'

export const Form = () => {
  const form = useAnnotatedUsersForm()
  const { data } = usePostsConfig()
  const { mutatePartial } = useMutatePostsConfig()

  const handleSubmit = useCallback((e: FormEvent) => {
    e.stopPropagation()
    e.preventDefault()
    form.handleSubmit()
  }, [])

  const handleDelete = useCallback(
    (item: UserNote) => {
      const userNotes = data.userNotes.filter(({ username }) => username !== item.username)
      mutatePartial({ userNotes })
    },
    [data.userNotes, mutatePartial]
  )

  return (
    <form
      onSubmit={handleSubmit}
      className='flex gap-2'
    >
      <form.Subscribe
        selector={state => state.isValid}
        children={isValid => (
          <Label
            className={cn('min-w-28 pt-1', !isValid && 'text-destructive')}
            htmlFor='username'
          >
            Añadir notas a usuario
          </Label>
        )}
      />
      <div className='w-full space-y-2'>
        <div className='flex w-full gap-2.5'>
          <div className='flex w-full gap-2'>
            <form.AppField
              name='username'
              children={field => (
                <field.FormItem className='w-full'>
                  <field.FormControl className='w-full'>
                    <field.FormInput
                      placeholder='Nick usuario'
                      autoComplete='off'
                    />
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            />
            <form.AppField
              name='note'
              children={field => (
                <field.FormItem className='w-full'>
                  <field.FormControl className='w-full'>
                    <field.FormInput
                      placeholder='Notas'
                      autoComplete='off'
                    />
                  </field.FormControl>
                  <field.FormMessage />
                </field.FormItem>
              )}
            />
          </div>
          <form.Subscribe
            selector={state => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button
                className='min-w-9'
                size='icon'
                variant='outline'
                type='submit'
                disabled={!canSubmit}
              >
                {isSubmitting ? <Loader2 className='animate-spin' /> : <UserRoundPlus />}
              </Button>
            )}
          />
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
  )
}
