import { type MouseEvent, useCallback } from 'react'

import { defaultValues, withForm } from '@/features/pinned-threads/hooks/use-form'
import { usePinnedThreads } from '@/features/pinned-threads/hooks/use-pinned-threads'
import { Portal } from '@/features/shared/components/portal'
import { RemoveItemsButton } from '@/features/shared/components/remove-items-button'

const styles = {
  float: 'right'
}

export const ActionButton = withForm({
  defaultValues,
  render: ({ form }) => {
    const { buttonsContainer, type } = usePinnedThreads()

    const handleSubmit = useCallback(async (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      e.preventDefault()
      await form.handleSubmit()
    }, [])

    return (
      <form.Subscribe
        selector={state => ({ items: state.values.items, isSubmitting: state.isSubmitting })}
        children={({ items, isSubmitting }) => (
          <Portal
            root={buttonsContainer}
            styles={styles}
          >
            <RemoveItemsButton
              onClick={handleSubmit}
              disabled={!items.length}
              submitting={isSubmitting}
              type={type}
            />
          </Portal>
        )}
      />
    )
  }
})
