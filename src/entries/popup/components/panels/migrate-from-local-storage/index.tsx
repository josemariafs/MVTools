import { AlertTriangle } from 'lucide-react'
import { useCallback } from 'react'
import browser from 'webextension-polyfill'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { URLS } from '@/constants'
import { NotInterestedButton } from '@/entries/popup/components/panels/migrate-from-local-storage/not-interested-button'
import { useGlobalConfig } from '@/entries/popup/hooks/use-global-config'
import { useIsMigratedFromLocalStorage } from '@/entries/popup/hooks/use-is-migrated-from-local-storage'
import { useStylesConfig } from '@/entries/popup/hooks/use-styles-config'
import { SCRIPT_FILES } from '@/types/content-script-assets'
import { initScriptFile } from '@/utils/background'

export const MigrateFromLocalStoragePanel = () => {
  const { data: globalConfig } = useGlobalConfig()
  const { data: stylesConfig } = useStylesConfig()
  const { data: isMigratedFromLocalStorage } = useIsMigratedFromLocalStorage()

  const handleMigrateClick = useCallback(async () => {
    const tab = await browser.tabs.create({ url: URLS.MEDIAVIDA, active: false })
    if (!tab.id) return

    await initScriptFile({
      tabId: tab.id,
      file: SCRIPT_FILES.MIGRATE_FROM_LOCAL_STORAGE,
      args: { globalConfig, stylesConfig },
      debugMessage: 'Migrating from local storage'
    })
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
          <NotInterestedButton />
        </div>
      </AlertDescription>
    </Alert>
  )
}
