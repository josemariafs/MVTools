import { useMemo } from 'react'
import browser from 'webextension-polyfill'

import { Button } from '@/components/ui/button'
import { Portal } from '@/features/shared/components/portal'
import { getDealData } from '@/services/chollometro'
import { type InjectDealScriptPayload, MESSAGE_TYPES } from '@/types/event-messages'
import { cn } from '@/utils/tailwind'

export const Deals = () => {
  const { buttonContainer, ...dealData } = useMemo(getDealData, [])

  const handleClick = () => {
    browser.runtime.sendMessage<InjectDealScriptPayload>({
      type: MESSAGE_TYPES.INJECT_DEAL_SCRIPT,
      deal: dealData
    })
  }

  return (
    <Portal root={buttonContainer}>
      <Button
        variant='none'
        className={cn(
          'text-foreground rounded-full bg-gray-700 px-7 h-9 text-start w-full text-lg font-bold leading-4 hover:bg-gray-500 mt-2',
          'lg:h-[54px] lg:mt-0 lg:ml-3',
          'md:h-[54px]'
        )}
        onClick={handleClick}
      >
        <img
          src={browser.runtime.getURL('icons/mvlogo.png')}
          alt='Media Vida Logo'
          className='size-5'
        />
        Crear oferta
      </Button>
    </Portal>
  )
}
