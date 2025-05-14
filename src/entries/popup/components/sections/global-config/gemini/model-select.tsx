import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useGeminiModels } from '@/entries/popup/components/sections/global-config/gemini/model-select.hooks'
import { useGlobalConfig, useMutateGlobalConfig } from '@/entries/popup/hooks/use-global-config'
import { cn } from '@/utils/tailwind'

export const ModelSelect = () => {
  const [open, setOpen] = useState(false)
  const { data: globalConfig } = useGlobalConfig()
  const { mutatePartial } = useMutateGlobalConfig()
  const {
    data: models,
    isLoading,
    isPlaceholderData
  } = useGeminiModels(globalConfig.geminiApiKey, {
    select: models => ({
      all: models,
      current: models.find(model => model.name === globalConfig.geminiModel)
    })
  })

  useEffect(() => {
    if (open && globalConfig.geminiModel) {
      setTimeout(() => {
        const selectedItem = document.querySelector(`[cmdk-item][data-value="${globalConfig.geminiModel}"]`)
        selectedItem && selectedItem.scrollIntoView({ block: 'center' })
      }, 10)
    }
  }, [open, globalConfig.geminiModel])

  return (
    <div className='flex w-full items-center gap-2.5'>
      <Label
        htmlFor='geminiModel'
        className='min-w-28'
      >
        Gemini Model
      </Label>

      <Popover
        open={open}
        onOpenChange={setOpen}
      >
        <PopoverTrigger asChild>
          <Button
            disabled={!models || isPlaceholderData}
            variant='outline'
            role='combobox'
            aria-expanded={open}
            aria-label='Select a model'
            className='w-full justify-between truncate px-3'
          >
            <div className='flex w-full items-center gap-2.5 truncate'>
              <span className='flex-1 truncate text-left'>{models?.current?.displayName ?? globalConfig.geminiModel}</span>
              {isLoading && (
                <Loader2
                  size={16}
                  className='animate-spin'
                />
              )}
            </div>
            <ChevronsUpDown className='opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-[var(--radix-popover-trigger-width)] p-0'>
          <Command loop>
            <CommandInput placeholder='Busca Modelos...' />
            <CommandEmpty>No Models found.</CommandEmpty>
            <CommandList className='h-[230px]'>
              <CommandGroup>
                {models?.all.map(model => (
                  <Tooltip
                    key={model.name}
                    delayDuration={0}
                    disableHoverableContent
                  >
                    <TooltipTrigger asChild>
                      <div>
                        <CommandItem
                          className='data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground'
                          value={model.name}
                          onSelect={() => {
                            mutatePartial({ geminiModel: model.name })
                            setOpen(false)
                          }}
                        >
                          <span className='truncate'>{model.displayName}</span>
                          <Check className={cn('ml-auto', globalConfig.geminiModel === model.name ? 'opacity-100' : 'opacity-0')} />
                        </CommandItem>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className='bg-popover text-popover-foreground max-w-[var(--radix-popper-anchor-width)] space-y-2 text-pretty border p-4 shadow-md'>
                      <div className='space-y-2'>
                        <h4 className='font-medium leading-none'>{model.name}</h4>
                        {model.description && <div className='text-muted-foreground text-sm'>{model.description}</div>}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
