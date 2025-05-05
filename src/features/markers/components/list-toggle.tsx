import { List } from 'lucide-react'
import { useCallback } from 'react'

import { Toggle } from '@/components/ui/toggle'
import { useMarkers } from '@/features/markers/hooks/use-markers'
import { Portal } from '@/features/shared/components/portal'
import { useUserPreferences } from '@/features/shared/hooks/use-user-preferences'
import { cn } from '@/utils/tailwind'

const styles = {
  float: 'right'
}

export const ListToggle = () => {
  const { markersListMode, setUserPreferences } = useUserPreferences()
  const { navButtonsContainer } = useMarkers()

  const handleClick = useCallback((pressed: boolean) => {
    setUserPreferences({ markersListMode: pressed })
  }, [])

  return (
    <Portal
      root={navButtonsContainer}
      styles={styles}
    >
      <Toggle
        title={!markersListMode ? 'Mostrar vista de lista' : 'Ocultar vista de lista'}
        pressed={markersListMode}
        onPressedChange={handleClick}
        variant='outline'
        size='sm'
        className={cn([
          'shadow-[0 2px 0 rgba(0,0,0,.03) rounded-[3px] border-[#09435d] bg-[#0d648c]',
          'hover:border-[#031b25] hover:bg-[#09435d]',
          'data-[state=on]:border-[#031b25] data-[state=on]:bg-[#09435d] hover:data-[state=on]:border-[#09435d] hover:data-[state=on]:bg-[#0d648c]'
        ])}
      >
        <List />
      </Toggle>
    </Portal>
  )
}
