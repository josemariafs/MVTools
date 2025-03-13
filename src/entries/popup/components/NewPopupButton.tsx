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
    if (!window) return

    const width = Math.max(self.outerWidth, document.documentElement.scrollWidth)
    const height = Math.max(outerHeight + 20, document.documentElement.scrollHeight + 39)

    browser.windows.create({
      type: 'popup',
      url: 'src/entries/popup/index.html',
      top: window.top! + 90,
      left: window.left! + window.width! - width - 15,
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
