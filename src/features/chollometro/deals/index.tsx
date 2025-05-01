import { useMemo } from 'react'
import browser from 'webextension-polyfill'

import { Button } from '@/components/ui/button'
import { useCreateDeal } from '@/features/chollometro/deals/hooks/use-create-deal'
import { Portal } from '@/features/shared/components/portal'
import { getDealData } from '@/services/chollometro'
import { cn } from '@/utils/tailwind'

export const Deals = () => {
  const { buttonContainer, ...dealData } = useMemo(getDealData, [])
  const { createDeal, isLoading } = useCreateDeal(dealData)

  return (
    <Portal
      root={buttonContainer}
      className='h-full'
    >
      <Button
        variant='none'
        className={cn(
          'text-foreground rounded-full bg-gray-700 px-7 h-9 text-start w-full text-base font-bold hover:bg-gray-500 mt-2',
          'lg:h-full lg:mt-0 lg:ml-3',
          'md:h-[54px] md:text-lg'
        )}
        onClick={createDeal}
        disabled={isLoading}
      >
        <img
          src={browser.runtime.getURL('shared/icons/mvlogo.png')}
          alt='Media Vida Logo'
          className={cn('size-5', isLoading && 'animate-spin')}
        />
        Crear oferta
      </Button>
    </Portal>
  )
}
