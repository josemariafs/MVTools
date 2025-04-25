import { Info } from 'lucide-react'

import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useStylesConfigForm } from '@/entries/popup/components/sections/styles/index.hooks'

import { MVPremiumLabel } from './mv-premium-label'

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
        <form className='space-y-2.5'>
          <form.AppField
            name='premiumEnabled'
            listeners={{
              onChange: ({ value }) => {
                !value && form.setFieldValue('premiumBgDisabled', false)
              }
            }}
            children={field => (
              <field.FormItem className='flex items-center justify-between space-y-0'>
                <field.FormLabel>
                  <MVPremiumLabel label='Activar estilos' />
                </field.FormLabel>
                <field.FormControl>
                  <field.FormSwitch onCheckedChange={() => form.handleSubmit()} />
                </field.FormControl>
              </field.FormItem>
            )}
          />
          <Separator />
          <form.AppField
            name='premiumBgDisabled'
            children={field => (
              <field.FormItem className='flex items-center justify-between space-y-0'>
                <field.FormLabel>
                  <MVPremiumLabel label='Quitar fondo' />
                </field.FormLabel>
                <field.FormControl>
                  <form.Subscribe
                    selector={state => state.values.premiumEnabled}
                    children={premiumEnabled => (
                      <field.FormSwitch
                        disabled={!premiumEnabled}
                        onCheckedChange={() => form.handleSubmit()}
                      />
                    )}
                  />
                </field.FormControl>
              </field.FormItem>
            )}
          />
          <Separator />
          <form.AppField
            name='ultraWideEnabled'
            children={field => (
              <field.FormItem className='flex items-center justify-between space-y-0'>
                <field.FormLabel>Modo Ultrawide</field.FormLabel>
                <field.FormControl>
                  <field.FormSwitch onCheckedChange={() => form.handleSubmit()} />
                </field.FormControl>
              </field.FormItem>
            )}
          />
        </form>
      </main>
    </section>
  )
}
