import { Info } from 'lucide-react'

import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import {
  useIsBackgroundDisabled,
  useIsPremiumEnabled,
  useIsUltraWideEnabled,
  useMutateIsBackgroundDisabled,
  useMutateIsPremiumEnabled,
  useMutateIsUltraWideEnabled
} from '@/entries/popup/components/sections/premium/hooks'

export const PremiumStylesSection = () => {
  const { data: isPremiumEnabled } = useIsPremiumEnabled()
  const { data: isBackgroundDisabled } = useIsBackgroundDisabled()
  const { data: isUltraWideEnabled } = useIsUltraWideEnabled()
  const { mutate: setPremiumEnabled } = useMutateIsPremiumEnabled()
  const { mutate: setBackgroundDisabled } = useMutateIsBackgroundDisabled()
  const { mutate: setUltraWideEnabled } = useMutateIsUltraWideEnabled()

  return (
    <section>
      <header className='flex items-center gap-2.5 pb-2'>
        <h1 className='text-xl font-bold text-orange-500'>MV Premium</h1>
        <Tooltip>
          <TooltipTrigger>
            <Info
              size={18}
              className='text-blue-200'
            />
          </TooltipTrigger>
          <TooltipContent className='w-full max-w-48'>
            <p>Se recomienda usar el Theme de Mediavida Oscuro cuando se activan los estilos de MV Premium.</p>
          </TooltipContent>
        </Tooltip>
      </header>
      <div className='items-center justify-between space-y-3 rounded-lg border p-3 shadow-sm'>
        <div className='flex w-full flex-row items-center justify-between'>
          <Label>Activar estilos</Label>
          <Switch
            checked={isPremiumEnabled}
            onCheckedChange={setPremiumEnabled}
          />
        </div>
        <Separator />
        <div className='flex w-full flex-row items-center justify-between'>
          <Label>Quitar fondo</Label>
          <Switch
            checked={isBackgroundDisabled}
            onCheckedChange={setBackgroundDisabled}
            disabled={!isPremiumEnabled}
          />
        </div>
        <Separator />
        <div className='flex w-full flex-row items-center justify-between'>
          <Label>Modo Ultrawide</Label>
          <Switch
            checked={isUltraWideEnabled}
            onCheckedChange={setUltraWideEnabled}
            disabled={!isPremiumEnabled}
          />
        </div>
      </div>
    </section>
  )
}
