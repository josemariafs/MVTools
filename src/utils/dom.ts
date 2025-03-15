import browser from 'webextension-polyfill'

import type { CssClassName } from '@/constants'

const loadedStyles = new Map<string, Promise<string>>()

const loadStyle = async (cssPath: string): Promise<string> => {
  if (loadedStyles.has(cssPath)) {
    return await loadedStyles.get(cssPath)!
  }

  const loadPromise: Promise<string> = fetch(cssPath).then(response => response.text())

  loadedStyles.set(cssPath, loadPromise)
  return await loadPromise
}

const applyStyleToShadow = async (cssPath: string, shadowRoot: ShadowRoot): Promise<void> => {
  const styleText: string = await loadStyle(browser.runtime.getURL(cssPath))
  const styleSheet: CSSStyleSheet = new CSSStyleSheet()
  styleSheet.replaceSync(styleText)
  shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, styleSheet]
}

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
    const stylePromises = cssPaths.map(cssPath => applyStyleToShadow(cssPath, shadowRoot))
    await Promise.all(stylePromises)
  }

  shadowRoot.appendChild(appRoot)
  where.appendChild(appContainer)
  render(appRoot)
}

export const toggleClass = (className: CssClassName, enable: boolean) => {
  const bodyClassList = document.body.classList
  enable ? bodyClassList.add(className) : bodyClassList.remove(className)
}

export const setDisplay = (element: HTMLElement[], display: 'none' | 'block') => {
  element.forEach(element => {
    element.style = `display: ${display}`
  })
}

export const createDOMElementIfNotPresent = ({
  id,
  container,
  where = 'beforeend',
  tagName = 'div'
}: {
  id: string
  container: HTMLElement | null
  where?: InsertPosition
  tagName?: keyof HTMLElementTagNameMap
}) => {
  const presentElement = document.getElementById(id)
  if (presentElement) return presentElement
  const element = document.createElement(tagName)
  element.id = id
  container?.insertAdjacentElement(where, element)
  return container ? element : undefined
}
