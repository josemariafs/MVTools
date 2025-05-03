import { Search, X } from 'lucide-react'
import * as React from 'react'
import { type ChangeEvent, useCallback } from 'react'

import { Button } from '@/components/ui/button'
import { Input, type InputProps } from '@/components/ui/input'
import { cn } from '@/utils/tailwind'

interface Props extends Omit<InputProps, 'onChange'> {
  onChange?: (value: string) => void
}

const SearchInput = React.forwardRef<HTMLInputElement, Props>(({ className, value: defaultValue, onChange, ...props }, ref) => {
  const [value, setValue] = React.useState(defaultValue ?? '')

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget
    setValue(value)
    onChange?.(value)
  }, [])

  const handleClearClick = useCallback(() => {
    setValue('')
    onChange?.('')
  }, [])

  return (
    <div className='relative w-full max-w-sm'>
      <Input
        ref={ref}
        {...props}
        className={cn('pr-10', className)}
        value={value}
        onChange={handleChange}
      />
      <Button
        type='button'
        variant='ghost'
        size='sm'
        className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
        onClick={handleClearClick}
        disabled={value === '' || props.disabled}
        aria-label='Clear search input'
      >
        {value !== '' ? (
          <X
            className='size-4'
            aria-hidden='true'
          />
        ) : (
          <Search
            className='size-4'
            aria-hidden='true'
          />
        )}
      </Button>
    </div>
  )
})
SearchInput.displayName = 'SearchInput'

export type SearchInputProps = React.ComponentProps<typeof SearchInput>

export { SearchInput }
