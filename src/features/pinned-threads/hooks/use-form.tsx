import { createFormHook, createFormHookContexts } from '@tanstack/react-form'

const { fieldContext, formContext } = createFormHookContexts()
export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {},
  formComponents: {},
  fieldContext,
  formContext
})

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Tanstack form way
export const defaultValues = {
  items: []
} as { items: string[] }
