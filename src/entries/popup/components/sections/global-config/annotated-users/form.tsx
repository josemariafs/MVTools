import { Loader2, UserRoundPlus } from 'lucide-react'
import { type FormEvent, useCallback } from 'react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { EditNoteForm } from '@/entries/popup/components/sections/global-config/annotated-users/edit-note-form'
import { useAnnotatedUsersForm } from '@/entries/popup/components/sections/global-config/annotated-users/form.hooks'
import { UserList } from '@/entries/popup/components/sections/global-config/user-list'
import { useGlobalConfig, useMutateGlobalConfig } from '@/entries/popup/hooks/use-global-config'
import { checkUserSchema, getUsernameSchema, noteSchema } from '@/entries/popup/services/validation'
import type { UserNote } from '@/services/config'
import { cn } from '@/utils/tailwind'
import { checkSchemaOnFieldValidatorAsync } from '@/utils/zod'

export const Form = () => {
  const form = useAnnotatedUsersForm()
  const { data } = useGlobalConfig()
  const { mutatePartial } = useMutateGlobalConfig()

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
            className={cn('min-w-28 max-w-28 pt-1', !isValid && 'text-destructive')}
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
              validators={{
                onChange: getUsernameSchema(data, 'userNotes'),
                onSubmitAsync: checkSchemaOnFieldValidatorAsync(checkUserSchema)
              }}
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
              validators={{ onChange: noteSchema }}
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
          itemClassName='items-stretch [&>svg]:mt-3.5 [&>button]:mt-1.5'
          renderItem={({ note, username }) => (
            <div className='flex w-full items-stretch'>
              <span className='w-full pt-2'>{username}</span>
              <span className='mr-4 w-full'>
                <EditNoteForm
                  note={note}
                  username={username}
                />
              </span>
            </div>
          )}
        />
      </div>
    </form>
  )
}
