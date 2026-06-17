import { Download, Upload } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { type ChangeEvent, useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  downloadBackupJson,
  exportMvtoolsBackup,
  formatBackupImportSummary,
  importMvtoolsBackup,
  parseMvtoolsBackupFile,
  readJsonFile,
  type ValidatedMvtoolsBackup
} from '@/services/config-backup'

export const BackupSection = () => {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [exporting, setExporting] = useState(false)
  const [pendingImport, setPendingImport] = useState<ValidatedMvtoolsBackup | null>(null)
  const [importing, setImporting] = useState(false)

  const handleExport = useCallback(async () => {
    setExporting(true)
    try {
      const backup = await exportMvtoolsBackup()
      downloadBackupJson(backup)
      toast.success('Copia de seguridad descargada')
    } catch {
      toast.error('No se pudo exportar la configuración')
    } finally {
      setExporting(false)
    }
  }, [])

  const handleFileChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    try {
      const raw = await readJsonFile(file)
      setPendingImport(parseMvtoolsBackupFile(raw))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Archivo de backup inválido'
      toast.error(message)
    }
  }, [])

  const handleConfirmImport = useCallback(async () => {
    if (!pendingImport) return

    setImporting(true)
    try {
      await importMvtoolsBackup(pendingImport)
      await queryClient.invalidateQueries()
      toast.success('Configuración restaurada correctamente')
      setPendingImport(null)
    } catch {
      toast.error('No se pudo importar la configuración')
    } finally {
      setImporting(false)
    }
  }, [pendingImport, queryClient])

  return (
    <section>
      <header className='flex items-center gap-2.5 pb-2'>
        <h1 className='text-xl font-bold text-orange-500'>Copia de seguridad</h1>
      </header>
      <main className='space-y-3 rounded-lg border p-3 shadow-sm'>
        <p className='text-sm text-muted-foreground'>
          Exporta o importa la configuración de MVTools (sync y local) antes de formatear o cambiar de navegador.
        </p>
        <div className='flex flex-wrap gap-2'>
          <Button
            type='button'
            onClick={() => {
              void handleExport()
            }}
            disabled={exporting}
            className='gap-1.5'
          >
            <Download size={16} />
            {exporting ? 'Exportando…' : 'Exportar'}
          </Button>
          <Button
            type='button'
            variant='secondary'
            className='gap-1.5'
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={16} />
            Importar
          </Button>
          <input
            ref={fileInputRef}
            type='file'
            accept='application/json,.json'
            className='hidden'
            onChange={event => {
              void handleFileChange(event)
            }}
          />
        </div>
      </main>

      <AlertDialog
        open={pendingImport != null}
        onOpenChange={open => {
          if (!open) setPendingImport(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Restaurar copia de seguridad?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingImport ? formatBackupImportSummary(pendingImport) : null}
              {' '}
              Se sobrescribirán los datos actuales de la extensión.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={importing}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={importing}
              onClick={event => {
                event.preventDefault()
                void handleConfirmImport()
              }}
            >
              {importing ? 'Importando…' : 'Restaurar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}
