import { Loader2, Trash2 } from 'lucide-react'
import { type MouseEvent, useCallback, useState } from 'react'

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
import { usePreventDataScrollLocked } from '@/features/pinned-threads/hooks/use-prevent-data-scroll-locked'
import { useShadowRoot } from '@/features/shared/hooks/use-shadow-root'
import { buttonVariants, cn } from '@/utils/tailwind'

interface ButtonProps {
  onClick: (e: MouseEvent<HTMLButtonElement>) => Promise<void>
  disabled: boolean
  submitting: boolean
  type: string
  className?: string
}

export const RemoveItemsButton = ({ onClick, disabled, submitting, type, className }: ButtonProps) => {
  const [open, setOpen] = useState(false)
  usePreventDataScrollLocked(open)
  const { appRoot } = useShadowRoot()

  const handleClick = useCallback(async (e: MouseEvent<HTMLButtonElement>) => {
    await onClick(e)
    setOpen(false)
  }, [])

  return (
    <AlertDialog
      open={open}
      onOpenChange={setOpen}
    >
      <AlertDialogTrigger asChild>
        <Button
          defaultStyles
          className={cn([
            'flex gap-1 rounded-[3px] bg-red-800 px-[12px] py-[5px] h-[32px] text-[#ecedef] border border-solid border-red-600 items-center justify-center',
            'hover:bg-red-950 hover:border-red-800',
            'disabled:pointer-events-none disabled:opacity-50',
            'shadow-[0 2px 0 rgba(0,0,0,.03)]',
            className
          ])}
          disabled={disabled}
        >
          <Trash2 size={14} /> Eliminar {type}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent container={appRoot}>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás totalmente seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción eliminará todos los {type} seleccionados. No podrás deshacer esta acción desde esta página y tendrás que volver a
            añadirlos manualmente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={submitting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleClick}
            className={buttonVariants({ variant: 'destructive' })}
          >
            Si, Eliminar {type} {submitting && <Loader2 className='animate-spin' />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
