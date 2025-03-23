import { createFormHook, createFormHookContexts } from '@tanstack/react-form'

import {
  FormControl,
  FormDescription,
  FormFieldWithIcon,
  FormInput,
  FormItem,
  FormLabel,
  FormMessage,
  FormPasswordInput,
  FormSwitch
} from '@/components/ui/form'

export const { fieldContext, formContext, useFieldContext } = createFormHookContexts()
export const { useAppForm } = createFormHook({
  fieldComponents: {
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormDescription,
    FormFieldWithIcon,
    FormInput,
    FormPasswordInput,
    FormSwitch
  },
  formComponents: {},
  fieldContext,
  formContext
})
