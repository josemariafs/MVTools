import { useAppForm } from '@/entries/popup/hooks/use-form'
import { useMutateGlobalConfig } from '@/entries/popup/hooks/use-global-config'

export const useIgnoredUsersForm = () => {
  const { mutatePartial } = useMutateGlobalConfig()

  return useAppForm({
    defaultValues: {
      ignoredUser: ''
    },
    onSubmit: ({ value: { ignoredUser }, formApi }) => {
      mutatePartial(oldData => ({ ignoredUsers: [...oldData.ignoredUsers, ignoredUser.trim()] }))
      formApi.reset()
    }
  })
}
