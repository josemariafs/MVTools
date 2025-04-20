import {
  asyncAnnotatedUsersSchema,
  getSyncAnnotatedUsersSchema
} from '@/entries/popup/components/sections/global-config/annotated-users/schema'
import { useAppForm } from '@/entries/popup/hooks/use-form'
import { useGlobalConfig, useMutateGlobalConfig } from '@/entries/popup/hooks/use-global-config'
import type { UserNote } from '@/services/config'
import { checkSchemaOnSubmitAsync } from '@/utils/zod'

export const useAnnotatedUsersForm = () => {
  const { data } = useGlobalConfig()
  const { mutatePartial } = useMutateGlobalConfig()
  return useAppForm({
    defaultValues: {
      username: '',
      note: ''
    },
    validators: {
      onSubmit: getSyncAnnotatedUsersSchema(data),
      onSubmitAsync: checkSchemaOnSubmitAsync(asyncAnnotatedUsersSchema)
    },
    onSubmit: ({ value, formApi }) => {
      const trimmedValues: UserNote = {
        username: value.username.trim(),
        note: value.note.trim()
      }

      mutatePartial({ userNotes: [...data.userNotes, trimmedValues] })
      formApi.reset()
    }
  })
}
