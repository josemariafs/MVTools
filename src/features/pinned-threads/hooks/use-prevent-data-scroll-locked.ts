import { useMutationObserver } from '@/features/shared/hooks/use-mutation-observer'

export const usePreventDataScrollLocked = (condition: boolean) => {
  useMutationObserver({
    target: document.body,
    callback: (mutations, observer) => {
      if (!condition) observer.disconnect()

      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-scroll-locked') {
          document.body.removeAttribute('data-scroll-locked')
        }
      }
    },
    deps: [condition],
    options: { attributes: true }
  })
}
