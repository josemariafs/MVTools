import { getHighlightedUsersSchema } from '@/entries/popup/components/sections/global-config/highlighted-users/schema'
import { useAppForm } from '@/entries/popup/hooks/use-form'
import { useGlobalConfig, useMutateGlobalConfig } from '@/entries/popup/hooks/use-global-config'

export const useHighlightedUsersForm = () => {
  const { data } = useGlobalConfig()
  const { mutatePartial } = useMutateGlobalConfig()

  return useAppForm({
    defaultValues: {
      highlightedUser: ''
    },
    validators: {
      onSubmitAsync: getHighlightedUsersSchema(data)
    },
    onSubmit: ({ value: { highlightedUser }, formApi }) => {
      mutatePartial(oldData => ({ highlightedUsers: [...oldData.highlightedUsers, highlightedUser.trim()] }))
      formApi.reset()
    }
  })
}
