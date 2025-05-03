import browser from 'webextension-polyfill'

import type { CssClassName } from '@/types/media-vida'
import { isHTMLElement } from '@/utils/asserts'

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

export const appendSonnerStyles = (shadowRoot: ShadowRoot) => {
  document.head.querySelectorAll('style').forEach(styleEl => {
    if (styleEl.textContent?.includes('[data-sonner-toaster]')) {
      shadowRoot.append(styleEl)
    }
  })
}

export const getAssetUrl = (assetPath: string) => {
  return new URL(assetPath, import.meta.url).href
}

export const renderContent = async ({
  render,
  where = 'beforeend',
  container = document.body,
  styles,
  cssPaths
}: {
  cssPaths: string[]
  render: (appRoot: HTMLElement, shadowRoot: ShadowRoot) => void
  container?: HTMLElement
  where?: InsertPosition
  styles?: Partial<CSSStyleDeclaration>
}) => {
  const appContainer = document.createElement('div')
  const appRoot = document.createElement('body')
  Object.assign(appContainer.style, styles)

  const shadowRoot = appContainer.attachShadow({
    mode: import.meta.env.MODE === 'development' ? 'open' : 'closed'
  })

  if (import.meta.hot) {
    const { addViteStyleTarget } = await import('@samrum/vite-plugin-web-extension/client')
    await addViteStyleTarget(shadowRoot)
  } else {
    const stylePromises = cssPaths.map(cssPath => applyStyleToShadow(cssPath, shadowRoot))
    await Promise.all(stylePromises)
  }

  shadowRoot.appendChild(appRoot)
  container.insertAdjacentElement(where, appContainer)
  render(appRoot, shadowRoot)
}

export const toggleBodyClass = (className: CssClassName, enable: boolean) => {
  const bodyClassList = document.body.classList
  enable ? bodyClassList.add(className) : bodyClassList.remove(className)
}

export const toggleStyle = (elements: HTMLElement | HTMLElement[], enable: boolean, style: Partial<CSSStyleDeclaration>) => {
  if (!Array.isArray(elements)) elements = [elements]

  elements.forEach(element => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- We need to set style properties dynamically
    enable ? Object.assign(element.style, style) : Object.keys(style).forEach(key => (element.style[key as any] = ''))
  })
}

/**
 * Searches mutations from MutationObserver for elements matching a query.
 * Returns an array with found matching elements.
 *
 * @param {MutationRecord[]} mutationList List of Mutations as passed to MutationObserver's callback.
 * @param {string} query Selector query that elements added in the Observed Mutation must match.
 * @returns {HTMLElement[]} Array of found elements.
 */
export function searchMutationListFor(mutationList: MutationRecord[], query: string): HTMLElement[] {
  const foundNodes: HTMLElement[] = []
  if (!mutationList.length) return foundNodes

  const findNodes = (addedNode: HTMLElement) => {
    addedNode.matches(query) && foundNodes.push(addedNode)
  }

  for (const element of mutationList) {
    if (!element.addedNodes.length) continue
    Array.from(element.addedNodes)
      .filter(({ nodeType }) => nodeType === 1)
      .forEach(node => {
        isHTMLElement(node) && findNodes(node)
      })
  }

  return foundNodes
}
