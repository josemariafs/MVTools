import { Info } from 'lucide-react'

import { Form } from '@/components/ui/form'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { FormSwitch } from '@/entries/popup/components/sections/styles/form-switch'
import { useStylesConfigForm } from '@/entries/popup/components/sections/styles/hooks'

export const StylesSection = () => {
  const form = useStylesConfigForm()

  return (
    <section>
      <header className='flex items-center gap-2.5 pb-2'>
        <h1 className='text-xl font-bold text-orange-500'>Estilos</h1>
        <Tooltip>
          <TooltipTrigger>
            <Info
              size={18}
              className='text-blue-200'
            />
          </TooltipTrigger>
          <TooltipContent
            className='w-full max-w-48'
            side='right'
          >
            <p>Se recomienda usar el Theme de Mediavida Oscuro cuando se activan los estilos de MV Premium.</p>
          </TooltipContent>
        </Tooltip>
      </header>
      <main className='items-center justify-between rounded-lg border p-3 shadow-sm'>
        <Form {...form}>
          <form className='space-y-2.5'>
            <FormSwitch
              name='premiumEnabled'
              label='Activar estilos'
              isMVPremium
            />
            <Separator />
            <FormSwitch
              name='premiumBgDisabled'
              disabled={!form.getValues('premiumEnabled')}
              label='Quitar fondo'
              isMVPremium
            />
            <Separator />
            <FormSwitch
              name='ultraWideEnabled'
              label='Modo Ultrawide'
            />
          </form>
        </Form>
      </main>
    </section>
  )
}
