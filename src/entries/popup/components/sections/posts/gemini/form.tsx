import { Loader2, Save } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Form as DefaultForm, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { PasswordInput } from '@/components/ui/password-input'
import { URLS } from '@/constants'
import { useGeminiForm } from '@/entries/popup/components/sections/posts/gemini/hooks'
import type { GeminiFormData } from '@/entries/popup/components/sections/posts/gemini/schema'
import { useMutatePostsConfig } from '@/entries/popup/components/sections/posts/hooks'

export const Form = () => {
  const form = useGeminiForm()
  const { mutatePartial } = useMutatePostsConfig({ toast: true })

  const onSubmit = (formData: GeminiFormData) => {
    mutatePartial(formData)
  }

  return (
    <DefaultForm {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex gap-2'
      >
        <FormField
          control={form.control}
          name='geminiApiKey'
          disabled={form.formState.isSubmitting}
          render={({ field }) => (
            <FormItem className='flex w-full gap-2 space-x-4 space-y-0'>
              <FormLabel className='min-w-fit pt-2.5'>Gemini API Key</FormLabel>
              <div className='w-full'>
                <FormControl>
                  <PasswordInput
                    {...field}
                    placeholder='Gemini API Key'
                    autoComplete='off'
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
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <Button
          size='icon'
          variant='outline'
          type='submit'
          className='min-w-fit'
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? <Loader2 className='animate-spin' /> : <Save />}
        </Button>
      </form>
    </DefaultForm>
  )
}
