import { Slot } from '@radix-ui/react-slot'
import { createFormHook, createFormHookContexts, type StandardSchemaV1Issue } from '@tanstack/react-form'
import type { LucideIcon } from 'lucide-react'
import React from 'react'

import { Input, type InputProps } from '@/components/ui/input'
import { PasswordInput, type PasswordInputProps } from '@/components/ui/password-input'
import { Switch, type SwitchProps } from '@/components/ui/switch'
import { cn } from '@/utils/tailwind'

import { buttonVariants } from './button'
import { Label, type LabelProps } from './label'

const { fieldContext, formContext, useFieldContext } = createFormHookContexts()

interface FormItemContextValues {
  id: string
  name: string
  hasError: boolean
  errors: StandardSchemaV1Issue[]
  formItemId: string
  formDescriptionId: string
  formMessageId: string
}
const FormItemContext = React.createContext<FormItemContextValues | undefined>(undefined)

const useFormItem = () => {
  const context = React.useContext(FormItemContext)

  if (typeof context === 'undefined') throw new Error('useFormItem should be used within <FormItemContext/>')

  return context
}

type FormItemProps = React.ComponentProps<'div'>
const FormItem: React.FC<FormItemProps> = ({ className, ...props }) => {
  const field = useFieldContext()
  const id = React.useId()
  const formItemContextValues = React.useMemo<FormItemContextValues>(
    () => ({
      id,
      name: field.name,
      hasError: field.state.meta.errors.length > 0,
      errors: field.state.meta.errors,
      formItemId: `${id}-${field.name}-item`,
      formDescriptionId: `${id}-${field.name}-description`,
      formMessageId: `${id}-${field.name}-message`
    }),
    [id, field.name, field.state.meta.errors]
  )

  return (
    <FormItemContext value={formItemContextValues}>
      <div
        id={`${id}-${field.name}`}
        className={cn('space-y-2', className)}
        {...props}
      />
    </FormItemContext>
  )
}

const FormLabel: React.FC<LabelProps> = ({ className, ...props }) => {
  const { hasError, formItemId } = useFormItem()
  return (
    <Label
      htmlFor={formItemId}
      className={cn(hasError && 'text-destructive', className)}
      {...props}
    />
  )
}

type FormControlProps = React.ComponentProps<typeof Slot>
const FormControl: React.FC<FormControlProps> = ({ ...props }) => {
  const { hasError, formItemId } = useFormItem()

  return (
    <Slot
      id={formItemId}
      aria-describedby={hasError ? `${formItemId}-error` : formItemId}
      aria-invalid={hasError}
      {...props}
    />
  )
}

type FormMessageProps = React.ComponentProps<'p'>
const FormMessage: React.FC<FormMessageProps> = ({ className, ...props }) => {
  const { hasError, errors, formMessageId } = useFormItem()

  return hasError ? (
    <p
      id={formMessageId}
      className={cn('text-[0.8rem] font-medium text-destructive', className)}
      {...props}
    >
      {errors.map(error => error.message).join(', ')}
    </p>
  ) : null
}

type FormDescriptionProps = React.ComponentProps<'p'>
const FormDescription: React.FC<FormDescriptionProps> = ({ className, ...props }) => {
  const { formDescriptionId } = useFormItem()

  return (
    <p
      id={formDescriptionId}
      className={cn('text-[0.8rem] text-muted-foreground', className)}
      {...props}
    />
  )
}

type FormFieldWithIconProps = React.ComponentProps<'div'> & {
  Icon: LucideIcon
}

const FormFieldWithIcon: React.FC<FormFieldWithIconProps> = ({ className, Icon, children, ...props }) => {
  const { hasError, id, name } = useFormItem()

  return (
    <div
      id={`${id}-${name}-field-with-icon`}
      className={cn('relative', className)}
      {...props}
    >
      <div
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'sm' }),
          'hover:bg-transparent',
          'absolute top-0 left-0 px-3 py-2 h-full inline-flex items-center justify-center',
          hasError && 'text-destructive'
        )}
      >
        <Icon
          size={12}
          className='size-4'
        />
      </div>
      <Slot className={'pl-9'}>{children}</Slot>
    </div>
  )
}

const FormInput = ({ className, ...props }: Omit<InputProps, 'value' | 'onChange'>) => {
  const field = useFieldContext<string>()

  return (
    <Input
      {...props}
      value={field.state.value}
      onChange={e => {
        field.handleChange(e.target.value)
      }}
    />
  )
}

const FormPasswordInput = (props: Omit<PasswordInputProps, 'value' | 'onChange'>) => {
  const field = useFieldContext<string>()

  return (
    <PasswordInput
      {...props}
      value={field.state.value}
      onChange={e => {
        field.handleChange(e.target.value)
      }}
    />
  )
}

const FormSwitch = ({ onCheckedChange, ...rest }: Omit<SwitchProps, 'checked'>) => {
  const field = useFieldContext<boolean>()

  return (
    <Switch
      {...rest}
      checked={field.state.value}
      onCheckedChange={checked => {
        field.handleChange(checked)
        onCheckedChange?.(checked)
      }}
    />
  )
}

export const {  useAppForm } = createFormHook({
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
