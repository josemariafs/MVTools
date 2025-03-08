import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useConfigForm } from '@/entries/popup/components/config-form/hooks'
import { FORM_FIELDS, type FormData } from '@/entries/popup/components/config-form/schema'

export const ConfigForm = () => {
  const form = useConfigForm()

  const onSubmit = (values: FormData) => {
    console.debug(values)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8'
      >
        <FormField
          control={form.control}
          name={FORM_FIELDS.USERNAME}
          render={({ field }) => (
            <FormItem className='flex gap-2 space-x-4 space-y-0'>
              <FormLabel className='pt-2.5'>Username</FormLabel>
              <div>
                <FormControl>
                  <Input
                    placeholder='Username'
                    {...field}
                  />
                </FormControl>
                <FormDescription>This is your public display name.</FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  )
}
