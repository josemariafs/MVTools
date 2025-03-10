import { Loader2, Save } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { PasswordInput } from '@/components/ui/password-input'
import { URLS } from '@/constants'
import { useGeminiForm, useMutateGeminiApiKey } from '@/entries/popup/components/sections/gemini/hooks'
import type { FormData } from '@/entries/popup/components/sections/gemini/schema'

export const GeminiSection = () => {
  const form = useGeminiForm()
  const { mutate: setApiKey } = useMutateGeminiApiKey()

  const onSubmit = ({ apiKey }: FormData) => {
    setApiKey(apiKey)
  }

  return (
    <section>
      <header className='flex items-center gap-2.5 pb-2'>
        <h1 className='text-xl font-bold text-orange-500'>Gemini</h1>
      </header>
      <main className='items-center justify-between space-y-3 rounded-lg border p-3 shadow-sm'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex gap-2'
          >
            <FormField
              control={form.control}
              name='apiKey'
              render={({ field }) => (
                <FormItem className='flex gap-2 space-x-4 space-y-0'>
                  <FormLabel className='pt-2.5'>API Key</FormLabel>
                  <div>
                    <FormControl>
                      <PasswordInput
                        placeholder='Gemini API Key'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
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
                    </FormDescription>
                    <FormMessage className='max-w-52' />
                  </div>
                </FormItem>
              )}
            />
            <Button
              size='icon'
              variant='outline'
              type='submit'
              disabled={form.formState.isValidating}
            >
              {form.formState.isValidating ? <Loader2 className='animate-spin' /> : <Save />}
            </Button>
          </form>
        </Form>
      </main>
    </section>
  )
}
