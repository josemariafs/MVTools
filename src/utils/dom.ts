import browser from 'webextension-polyfill'

import type { CssClassName } from '@/constants'

export const renderContent = (cssPaths: string[], render: (appRoot: HTMLDivElement) => void) => {
  const appContainer = document.createElement('div')

  if (!import.meta.hot) {
    cssPaths.forEach(cssPath => {
      const styleEl = document.createElement('link')
      styleEl.setAttribute('rel', 'stylesheet')
      styleEl.setAttribute('href', browser.runtime.getURL(cssPath))
      document.head.appendChild(styleEl)
    })
  }

  document.body.appendChild(appContainer)

  render(appContainer)
}

export const toggleClass = (className: CssClassName, enable: boolean) => {
  const bodyClassList = document.body.classList
  enable ? bodyClassList.add(className) : bodyClassList.remove(className)
}
