import { type MouseEvent, useCallback } from 'react'

import { SubmitButton } from '@/features/pinned-threads/components/action-button/submit-button'
import { defaultValues, withForm } from '@/features/pinned-threads/hooks/use-form'
import { usePinnedThreads } from '@/features/pinned-threads/hooks/use-pinned-threads'
import { Portal } from '@/features/shared/components/portal'

const styles = {
  display: 'inline-block',
  paddingLeft: '5px',
  alignSelf: 'end',
  position: 'absolute'
}

export const ActionButton = withForm({
  defaultValues,
  render: ({ form }) => {
    const { buttonsContainer } = usePinnedThreads()

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
            <SubmitButton
              items={items}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </Portal>
        )}
      />
    )
  }
})
