import { Suspense } from '@suspensive/react'

import { useStorageListeners } from '@/entries/popup/App.hooks'
import { NewPopupButton } from '@/entries/popup/components/new-popup-button'
import { MigrateFromLocalStoragePanel } from '@/entries/popup/components/panels/migrate-from-local-storage'
import { GlobalConfigSection } from '@/entries/popup/components/sections/global-config'
import { StylesSection } from '@/entries/popup/components/sections/styles'
import { useCurrentBrowserWindow } from '@/entries/popup/hooks/use-current-browser-window'
import { cn } from '@/utils/tailwind'

const App = () => {
  const { isPopup } = useCurrentBrowserWindow()
  useStorageListeners()

  return (
    <main
      className={cn(
        'min-h-maxPopupHeight relative h-screen min-w-[500px] overflow-auto border-x-4 border-x-orange-500 p-6',
        !isPopup && 'max-w-[500px]'
      )}
    >
      <Suspense>
        <MigrateFromLocalStoragePanel />
      </Suspense>
      <NewPopupButton />
      <div className='space-y-5'>
        <StylesSection />
        <GlobalConfigSection />
      </div>
    </main>
  )
}

export default App
