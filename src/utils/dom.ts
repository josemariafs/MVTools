import browser from 'webextension-polyfill'

import type { CssClassName } from '@/constants'

export const renderContent = async (cssPaths: string[], where: HTMLElement = document.body, render: (appRoot: HTMLElement) => void) => {
  const appContainer = document.createElement('section')
  const shadowRoot = appContainer.attachShadow({
    mode: import.meta.env.MODE === 'development' ? 'open' : 'closed'
  })
  const appRoot = document.createElement('html')

  if (import.meta.hot) {
    const { addViteStyleTarget } = await import('@samrum/vite-plugin-web-extension/client')
    await addViteStyleTarget(shadowRoot)
  } else {
    for (const cssPath of cssPaths) {
      const styleEl = document.createElement('link')
      styleEl.setAttribute('rel', 'stylesheet')
      styleEl.setAttribute('href', browser.runtime.getURL(cssPath))
      appRoot.appendChild(styleEl)
    }
  }

  shadowRoot.appendChild(appRoot)
  where.appendChild(appContainer)
  render(appRoot)
}

export const toggleClass = (className: CssClassName, enable: boolean) => {
  const bodyClassList = document.body.classList
  enable ? bodyClassList.add(className) : bodyClassList.remove(className)
}
