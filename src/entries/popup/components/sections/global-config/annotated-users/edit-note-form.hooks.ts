import { z } from 'zod'

import { noteSchema } from '@/entries/popup/components/sections/global-config/annotated-users/schema'
import { useAppForm } from '@/entries/popup/hooks/use-form'
import { useMutateGlobalConfig } from '@/entries/popup/hooks/use-global-config'
import type { UserNote } from '@/services/config'

export const useForm = ({ note, username }: UserNote) => {
  const { mutatePartial } = useMutateGlobalConfig({ toast: true })

  return useAppForm({
    defaultValues: { note },
    validators: {
      onChange: z.object({ note: noteSchema })
    },
    onSubmit: ({ value: { note: newNote }, formApi }) => {
      const trimmedNote = newNote.trim()
      formApi.setFieldValue('note', trimmedNote)
      if (trimmedNote === note) return

      mutatePartial(oldData => ({
        userNotes: oldData.userNotes.map(userNote => {
          if (userNote.username === username) {
            return { ...userNote, note: trimmedNote }
          }
          return userNote
        })
      }))
    }
  })
}
