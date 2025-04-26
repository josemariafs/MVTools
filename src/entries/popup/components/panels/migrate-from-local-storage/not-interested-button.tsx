import { useCallback, useState } from 'react'
import browser from 'webextension-polyfill'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { MESSAGE_TYPES, type MigratedFromLocalStoragePayload } from '@/types/event-messages'
import { buttonVariants } from '@/utils/tailwind'

export const NotInterestedButton = () => {
  const [open, setOpen] = useState(false)

  const openDialog = useCallback(() => {
    setOpen(true)
  }, [])

  const handleNotInterestedClick = useCallback(() => {
    browser.runtime.sendMessage<MigratedFromLocalStoragePayload>({ type: MESSAGE_TYPES.MIGRATED_FROM_LOCAL_STORAGE, migrated: true })
  }, [])

  return (
    <AlertDialog
      open={open}
      onOpenChange={setOpen}
    >
      <AlertDialogTrigger asChild>
        <Button
          variant='secondary'
          onClick={openDialog}
        >
          No me interesa
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás totalmente seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Si no migras la configuración, perderás todos los datos guardados en la versión anterior de la extensión.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleNotInterestedClick}
            className={buttonVariants({ variant: 'destructive' })}
          >
            Si, no me interesa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
