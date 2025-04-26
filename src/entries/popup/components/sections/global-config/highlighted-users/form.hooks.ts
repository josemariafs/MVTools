import { useAppForm } from '@/entries/popup/hooks/use-form'
import { useMutateGlobalConfig } from '@/entries/popup/hooks/use-global-config'

export const useHighlightedUsersForm = () => {
  const { mutatePartial } = useMutateGlobalConfig()

  return useAppForm({
    defaultValues: {
      highlightedUser: ''
    },
    onSubmit: ({ value: { highlightedUser }, formApi }) => {
      mutatePartial(oldData => ({ highlightedUsers: [...oldData.highlightedUsers, highlightedUser.trim()] }))
      formApi.reset()
    }
  })
}
