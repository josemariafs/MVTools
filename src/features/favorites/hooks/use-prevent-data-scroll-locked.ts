import { useMutationObserver } from '@/features/shared/hooks/use-mutation-observer'

export const usePreventDataScrollLocked = () => {
  useMutationObserver({
    target: document.body,
    callback: mutations => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-scroll-locked') {
          document.body.removeAttribute('data-scroll-locked')
        }
      }
    },
    options: { attributes: true }
  })
}
