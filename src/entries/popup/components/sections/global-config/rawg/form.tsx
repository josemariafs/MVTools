import { Loader2, Save } from 'lucide-react'
import { type FormEvent, useCallback } from 'react'

import { Button } from '@/components/ui/button'
import { URLS } from '@/constants'
import { useRawgForm } from '@/entries/popup/components/sections/global-config/rawg/form.hooks'

export const Form = () => {
  const form = useRawgForm()

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.stopPropagation()
      e.preventDefault()
      form.handleSubmit()
    },
    [form]
  )

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-3'
    >
      <form.AppField
        name='rawgApiKey'
        children={field => (
          <field.FormItem className='flex w-full gap-2.5 space-y-0'>
            <field.FormLabel className='min-w-28 pt-2.5'>RAWG API Key</field.FormLabel>
            <div className='flex w-full gap-2.5'>
              <div className='w-full'>
                <field.FormControl>
                  <field.FormPasswordInput
                    placeholder='Clave API de RAWG'
                    autoComplete='off'
                  />
                </field.FormControl>
                <field.FormDescription>
                  <Button
                    variant='link'
                    type='button'
                    className='h-fit p-0 pt-1.5 text-orange-500'
                    asChild
                  >
                    <a
                      href={URLS.RAWG_APIDOCS}
                      target='_blank'
                      rel='noreferrer'
                    >
                      Registro y documentación de la API
                    </a>
                  </Button>
                </field.FormDescription>
                <field.FormMessage className='pt-1' />
              </div>
              <form.Subscribe
                selector={state => [state.isSubmitting, state.canSubmit]}
                children={([isSubmitting, canSubmit]) => (
                  <Button
                    size='icon'
                    variant='outline'
                    type='submit'
                    className='min-w-9'
                    disabled={!canSubmit}
                  >
                    {isSubmitting ? <Loader2 className='animate-spin' /> : <Save />}
                  </Button>
                )}
              />
            </div>
          </field.FormItem>
        )}
      />
    </form>
  )
}
