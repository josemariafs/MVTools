import { type FormEvent, type KeyboardEvent, useCallback, useRef } from 'react'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useForm } from '@/entries/popup/components/sections/global-config/annotated-users/edit-note-form.hooks'
import type { UserNote } from '@/services/config'
import { cn } from '@/utils/tailwind'

export const EditNoteForm = ({ note, username }: UserNote) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const form = useForm({ note, username })

  const preventDefaultHandler = useCallback((e: FormEvent) => {
    e.preventDefault()
  }, [])

  const handleSubmit = useCallback((e: FormEvent) => {
    e.stopPropagation()
    e.preventDefault()
    form.handleSubmit()
  }, [])

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return
    inputRef.current?.blur()
  }, [])

  return (
    <form.AppField
      name='note'
      children={field => (
        <field.FormItem className='w-full'>
          <field.FormControl className='w-full'>
            <Tooltip>
              <TooltipTrigger className='w-full'>
                <field.FormInput
                  ref={inputRef}
                  onClick={preventDefaultHandler}
                  onBlur={handleSubmit}
                  onKeyDown={handleKeyDown}
                  onKeyUp={preventDefaultHandler}
                  className={cn(
                    'truncate',
                    field.state.meta.errors.length ? 'border-destructive focus-visible:border-none' : 'border-none'
                  )}
                />
              </TooltipTrigger>
              {field.state.value.trim() && (
                <TooltipContent
                  align='start'
                  className='max-w-56 text-balance text-left'
                >
                  {field.state.value}
                </TooltipContent>
              )}
            </Tooltip>
          </field.FormControl>
          <field.FormMessage />
        </field.FormItem>
      )}
    />
  )
}
