import { ExternalLink } from 'lucide-react'
import { useEffect, useState } from 'react'
import browser, { type Windows } from 'webextension-polyfill'

import { Button } from '@/components/ui/button'

export const NewPopupButton = () => {
  const [window, setWindow] = useState<Windows.Window>()

  useEffect(() => {
    browser.windows.getCurrent().then(setWindow)
  }, [])

  const handleNewWindowClick = () => {
    const width = Math.max(outerWidth + 20, document.documentElement.scrollWidth + 39)
    const height = Math.max(outerHeight + 20, document.documentElement.scrollHeight + 39)
    const popupUrl = browser.runtime.getURL('src/entries/popup/index.html')

    browser.windows.create({
      type: 'popup',
      url: popupUrl,
      top: window!.top! + 90,
      left: window!.left! + window!.width! - width - 15,
      height,
      width
    })
    close()
  }

  if (window?.type === 'popup') return null

  return (
    <Button
      variant='ghost'
      size='icon'
      className='absolute right-2 top-2 size-7'
      title='Abrir en una nueva ventana'
      onClick={handleNewWindowClick}
    >
      <ExternalLink />
    </Button>
  )
}
