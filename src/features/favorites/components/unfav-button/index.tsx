import { type MouseEventHandler, useCallback } from 'react'

import { SubmitButton } from '@/features/favorites/components/unfav-button/submit-button'
import { useFavorites } from '@/features/favorites/hooks/use-favorites'
import { defaultValues, withForm } from '@/features/favorites/hooks/use-form'
import { Portal } from '@/features/shared/components/portal'

const styles = {
  display: 'inline-block',
  paddingLeft: '5px',
  alignSelf: 'end',
  position: 'absolute'
}

export const UnfavButton = withForm({
  defaultValues,
  render: ({ form }) => {
    const { buttonsContainer } = useFavorites()

    const handleSubmit: MouseEventHandler<HTMLButtonElement> = useCallback(e => {
      e.stopPropagation()
      e.preventDefault()
      form.handleSubmit()
    }, [])

    return (
      <form.Subscribe
        selector={state => ({ items: state.values.items, isSubmitting: state.isSubmitting })}
        children={({ items, isSubmitting }) => (
          <Portal
            theme='dark'
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
