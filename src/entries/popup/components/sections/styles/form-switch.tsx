import { useFormContext } from 'react-hook-form'

import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { useMutateStylesConfig } from '@/entries/popup/components/sections/styles/hooks'
import type { StylesConfig } from '@/services/config'

interface Props {
  name: keyof StylesConfig
  label: string
  isMVPremium?: boolean
  disabled?: boolean
}

const MVPremiumLabel = ({ label }: { label: string }) => (
  <>
    {label} <span className='text-orange-500'>MV Premium</span>
  </>
)

export const FormSwitch = ({ name, label, disabled, isMVPremium }: Props) => {
  const { control, handleSubmit, setValue } = useFormContext<StylesConfig>()
  const { mutate } = useMutateStylesConfig()

  const onSubmit = ({ premiumEnabled, premiumBgDisabled, ...rest }: StylesConfig) => {
    mutate({
      ...rest,
      premiumEnabled,
      premiumBgDisabled: !premiumEnabled ? false : premiumBgDisabled
    })

    if (!premiumEnabled) {
      setValue('premiumBgDisabled', false)
    }
  }

  return (
    <FormField
      control={control}
      name={name}
      disabled={disabled}
      render={({ field: { value, onChange, ...rest } }) => (
        <FormItem className='flex items-center justify-between space-y-0'>
          <FormLabel>{isMVPremium ? <MVPremiumLabel label={label} /> : label}</FormLabel>
          <FormControl>
            <Switch
              checked={value}
              onCheckedChange={checked => {
                onChange(checked)
                handleSubmit(onSubmit)()
              }}
              {...rest}
            />
          </FormControl>
        </FormItem>
      )}
    />
  )
}
