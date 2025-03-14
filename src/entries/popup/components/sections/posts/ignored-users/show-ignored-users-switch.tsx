import { Info } from 'lucide-react'

import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useMutatePostsConfig, usePostsConfig } from '@/entries/popup/components/sections/posts/hooks'

export const ShowIgnoredUsersSwitch = () => {
  const { data } = usePostsConfig()
  const { mutatePartial } = useMutatePostsConfig()

  return (
    <div className='flex w-full gap-2 space-x-4 space-y-0'>
      <Label
        htmlFor='showIgnoredUsers'
        className='w-36'
      >
        Ver mensajes ignorados
      </Label>
      <div className='flex w-full items-center justify-between pr-1.5'>
        <Switch
          id='showIgnoredUsers'
          checked={data.showIgnoredUsers}
          onCheckedChange={checked => {
            mutatePartial({ showIgnoredUsers: checked })
          }}
        />
        <Tooltip>
          <TooltipTrigger>
            <Info
              size={18}
              className='text-blue-200'
            />
          </TooltipTrigger>
          <TooltipContent className='w-full max-w-48'>
            <p>Si esta opción está activada se podrá mostrar mensajes de usuarios ignorados.</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
