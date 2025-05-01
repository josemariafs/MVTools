import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import browser from 'webextension-polyfill'

import { type Deal, DealPayloadSchema } from '@/types/event-messages'

export const useCreateDeal = (deal: Deal) => {
  const [isLoading, setIsLoading] = useState(false)
  const loadingTimeoutRef = useRef<NodeJS.Timeout>(null)

  const createDeal = useCallback(() => {
    setIsLoading(true)
    /* eslint-disable-next-line @typescript-eslint/no-empty-function
      -- This fetch will always fail, so we can safely ignore it.
      Triggers the service worker function to get the actual deal link.
     */
    fetch(deal.link).catch(() => {})
  }, [deal.link])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/require-await -- Need to be async to return the data w/o using sendResponse
    const listener = async (message: unknown) => {
      const isValidMessage = DealPayloadSchema.safeParse(message)
      if (!isValidMessage.success) return

      setIsLoading(false)
      return deal
    }

    browser.runtime.onMessage.addListener(listener)

    return () => {
      browser.runtime.onMessage.removeListener(listener)
    }
  }, [deal])

  const clearLoadingTimeout = useCallback(() => {
    if (!loadingTimeoutRef.current) return

    clearTimeout(loadingTimeoutRef.current)
    loadingTimeoutRef.current = null
  }, [])

  useEffect(() => {
    if (!isLoading) {
      clearLoadingTimeout()
      return
    }

    loadingTimeoutRef.current = setTimeout(() => {
      toast.error('Error al intentar poner la oferta en MV')
      setIsLoading(false)
      loadingTimeoutRef.current = null
    }, 5000)

    return clearLoadingTimeout
  }, [isLoading])

  return {
    isLoading,
    createDeal
  }
}
