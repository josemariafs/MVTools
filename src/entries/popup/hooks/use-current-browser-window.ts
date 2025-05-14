import { useEffect, useState } from 'react'
import browser, { type Windows } from 'webextension-polyfill'

export const useCurrentBrowserWindow = () => {
  const [window, setWindow] = useState<Windows.Window>()

  useEffect(() => {
    browser.windows.getCurrent().then(setWindow)
  }, [])

  return {
    window,
    isPopup: window?.type === 'popup'
  }
}
