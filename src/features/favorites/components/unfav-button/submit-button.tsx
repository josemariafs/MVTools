import { Loader2, Trash2 } from 'lucide-react'
import { type MouseEventHandler, useCallback, useState } from 'react'

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
import { useShadowRoot } from '@/features/shared/hooks/use-shadow-root'
import { cn } from '@/utils/tailwind'

interface ButtonProps {
  onSubmit: MouseEventHandler<HTMLButtonElement>
  items: string[]
  isSubmitting: boolean
}

export const SubmitButton = ({ onSubmit, items, isSubmitting }: ButtonProps) => {
  const [open, setOpen] = useState(false)
  const { appRoot } = useShadowRoot()

  const handleSubmit: MouseEventHandler<HTMLButtonElement> = useCallback(e => {
    setOpen(false)
    onSubmit(e)
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
            'shadow-[0 2px 0 rgba(0,0,0,.03)]'
          ])}
          disabled={!items.length}
        >
          {isSubmitting ? <Loader2 className='animate-spin' /> : <Trash2 size={14} />} <span>Eliminar favoritos</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent container={appRoot}>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás totalmente seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción eliminará todos los favoritos seleccionados. No podrás deshacer esta acción desde esta página y tendrás que volver a
            añadirlos manualmente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
