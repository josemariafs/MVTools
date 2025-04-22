import { useAppForm } from '@/entries/popup/hooks/use-form'
import { useMutateGlobalConfig } from '@/entries/popup/hooks/use-global-config'
import type { UserNote } from '@/services/config'

export const useAnnotatedUsersForm = () => {
  const { mutatePartial } = useMutateGlobalConfig()
  return useAppForm({
    defaultValues: {
      username: '',
      note: ''
    },
    onSubmit: ({ value, formApi }) => {
      const trimmedValues: UserNote = {
        username: value.username.trim(),
        note: value.note.trim()
      }

      mutatePartial(oldData => ({ userNotes: [...oldData.userNotes, trimmedValues] }))
      formApi.reset()
    }
  })
}
