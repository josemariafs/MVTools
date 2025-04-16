import { AlertTriangle } from 'lucide-react'
import { useCallback } from 'react'
import browser from 'webextension-polyfill'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  useIsMigratedFromLocalStorage,
  useMutateIsMigratedFromLocalStorage
} from '@/entries/popup/hooks/use-is-migrated-from-local-storage'
import { SCRIPT_FILES } from '@/types/file-assets'
import { initScript, updatePopupBadge } from '@/utils/browser-extension'

export const MigrateFromLocalStoragePanel = () => {
  const { data: isMigratedFromLocalStorage } = useIsMigratedFromLocalStorage()
  const { mutate } = useMutateIsMigratedFromLocalStorage()

  const handleNotInterestedClick = useCallback(() => {
    mutate(true)
    updatePopupBadge({ pendingUpgrade: false })
  }, [])

  const handleMigrateClick = useCallback(async () => {
    const tab = await browser.tabs.create({ url: 'https://www.mediavida.com' })
    if (!tab.id) return
    await initScript({ tabId: tab.id, file: SCRIPT_FILES.MIGRATE_FROM_LOCAL_STORAGE, debugMessage: 'Migrating from local storage' })
  }, [])

  if (isMigratedFromLocalStorage) return null

  return (
    <Alert className='mb-4 bg-yellow-700'>
      <AlertTriangle className='size-4' />
      <AlertTitle>Migración de configuración disponible</AlertTitle>
      <AlertDescription className='flex flex-col gap-3 py-1'>
        <span>Puedes migrar la configuración guardada de la versión anterior automáticamente.</span>
        <span>Al pulsar el botón migrar, se abrirá una página de Mediavida y copiará la configuración guardada en la extensión.</span>
        <div className='space-x-1.5'>
          <Button onClick={handleMigrateClick}>Migrar</Button>
          <Button
            variant='secondary'
            onClick={handleNotInterestedClick}
          >
            No me interesa
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
