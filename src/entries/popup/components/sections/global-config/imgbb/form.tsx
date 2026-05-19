import { Loader2, Save } from 'lucide-react'
import { type FormEvent, useCallback } from 'react'

import { Button } from '@/components/ui/button'
import { URLS } from '@/constants'
import { useImgbbForm } from '@/entries/popup/components/sections/global-config/imgbb/form.hooks'

export const Form = () => {
  const form = useImgbbForm()

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
        name='imgbbApiKey'
        children={field => (
          <field.FormItem className='flex w-full gap-2.5 space-y-0'>
            <field.FormLabel className='min-w-28 pt-2.5'>ImgBB API Key</field.FormLabel>
            <div className='flex w-full gap-2.5'>
              <div className='w-full'>
                <field.FormControl>
                  <field.FormPasswordInput
                    placeholder='Clave gratuita ImgBB'
                    autoComplete='off'
                  />
                </field.FormControl>
                <field.FormDescription className='text-muted-foreground'>
                  Convierte cabecera y capturas Steam a PNG/GIF y las sube para usar `[img]` cortos en hilos de
                  juegos (sin data URLs que disparan el límite de caracteres).
                  <Button
                    variant='link'
                    type='button'
                    className='h-fit p-0 pl-1 pt-1.5 text-orange-500'
                    asChild
                  >
                    <a
                      href={URLS.IMGBB_API}
                      target='_blank'
                      rel='noreferrer'
                    >
                      Obtener clave en api.imgbb.com
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
