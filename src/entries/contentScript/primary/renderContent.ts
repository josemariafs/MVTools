import browser from 'webextension-polyfill'

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
