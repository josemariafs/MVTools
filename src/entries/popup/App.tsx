import { Suspense } from '@suspensive/react'

import { MigrateFromLocalStoragePanel } from '@/entries/popup/components/migrate-from-local-storage-panel'
import { NewPopupButton } from '@/entries/popup/components/new-popup-button'
import { GlobalConfigSection } from '@/entries/popup/components/sections/global-config'
import { StylesSection } from '@/entries/popup/components/sections/styles'

const App = () => {
  return (
    <main className='min-h-maxPopupHeight relative h-screen min-w-[500px] overflow-auto border-x-4 border-x-orange-500 p-6'>
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
