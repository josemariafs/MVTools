import { ExternalLink } from 'lucide-react'
import { useEffect, useState } from 'react'
import browser from 'webextension-polyfill'

import { Button } from '@/components/ui/button'

export const NewPopupButton = () => {
  const [isPopup, setIsPopup] = useState(false)

  useEffect(() => {
    browser.windows.getCurrent().then(window => {
      setIsPopup(window.type === 'popup')
    })
  }, [])

  const handleNewWindowClick = () => {
    browser.windows.create({
      type: 'popup',
      focused: !0,
      url: 'src/entries/popup/index.html',
      top: self.screenTop + 15,
      left: self.screenLeft + 100,
      height: self.innerHeight + 20,
      width: self.innerWidth
    })
    self.close()
  }

  if (isPopup) return null

  return (
    <Button
      variant='ghost'
      size='icon'
      className='absolute right-2 top-2 size-7'
      title='Open in new window'
      onClick={handleNewWindowClick}
    >
      <ExternalLink />
    </Button>
  )
}
