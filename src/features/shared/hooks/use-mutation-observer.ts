import { type DependencyList, useEffect } from 'react'

const defaultOptions: MutationObserverInit = {
  childList: true,
  subtree: true
}

interface Props {
  target: Node
  callback: MutationCallback
  options?: MutationObserverInit
  onUnmount?: () => void
  deps?: DependencyList
}

export const useMutationObserver = ({ target, callback, options = defaultOptions, onUnmount, deps = [] }: Props) => {
  useEffect(() => {
    const observer = new MutationObserver(callback)
    observer.observe(target, options)

    return () => {
      onUnmount?.()
      observer.disconnect()
    }
  }, deps)
}
