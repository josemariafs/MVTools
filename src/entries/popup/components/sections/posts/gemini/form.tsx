import { Loader2, Save } from 'lucide-react'
import { type FormEvent, useCallback } from 'react'

import { Button } from '@/components/ui/button'
import { URLS } from '@/constants'
import { useGeminiForm } from '@/entries/popup/components/sections/posts/gemini/hooks'

export const Form = () => {
  const form = useGeminiForm()

  const handleSubmit = useCallback((e: FormEvent) => {
    e.stopPropagation()
    e.preventDefault()
    form.handleSubmit()
  }, [])

  return (
    <form
      onSubmit={handleSubmit}
      className='flex gap-2'
    >
      <form.AppField
        name='geminiApiKey'
        children={field => (
          <field.FormItem className='flex w-full gap-2.5 space-y-0'>
            <field.FormLabel className='min-w-28 pt-2.5'>Gemini API Key</field.FormLabel>
            <div className='flex w-full gap-2.5'>
              <div className='w-full'>
                <field.FormControl>
                  <field.FormPasswordInput
                    placeholder='Gemini API Key'
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
                      href={URLS.GEMINI_CREATE_API_KEY}
                      target='_blank'
                      rel='noreferrer'
                    >
                      Clicka aquí para generar una API Key
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
