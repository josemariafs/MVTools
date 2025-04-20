import {
  asyncHighlightedUsersSchema,
  getSyncHighlightedUsersSchema
} from '@/entries/popup/components/sections/global-config/highlighted-users/schema'
import { useAppForm } from '@/entries/popup/hooks/use-form'
import { useGlobalConfig, useMutateGlobalConfig } from '@/entries/popup/hooks/use-global-config'
import { checkSchemaOnSubmitAsync } from '@/utils/zod'

export const useHighlightedUsersForm = () => {
  const { data } = useGlobalConfig()
  const { mutatePartial } = useMutateGlobalConfig()

  return useAppForm({
    defaultValues: {
      highlightedUser: ''
    },
    validators: {
      onSubmit: getSyncHighlightedUsersSchema(data),
      onSubmitAsync: checkSchemaOnSubmitAsync(asyncHighlightedUsersSchema)
    },
    onSubmit: ({ value: { highlightedUser }, formApi }) => {
      mutatePartial(oldData => ({ highlightedUsers: [...oldData.highlightedUsers, highlightedUser.trim()] }))
      formApi.reset()
    }
  })
}
