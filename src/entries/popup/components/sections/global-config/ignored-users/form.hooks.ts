import { getIgnoredUsersSchema } from '@/entries/popup/components/sections/global-config/ignored-users/schema'
import { useAppForm } from '@/entries/popup/hooks/use-form'
import { useGlobalConfig, useMutateGlobalConfig } from '@/entries/popup/hooks/use-global-config'

export const useIgnoredUsersForm = () => {
  const { data } = useGlobalConfig()
  const { mutatePartial } = useMutateGlobalConfig()

  return useAppForm({
    defaultValues: {
      ignoredUser: ''
    },
    validators: {
      onSubmitAsync: getIgnoredUsersSchema(data)
    },
    onSubmit: ({ value: { ignoredUser }, formApi }) => {
      mutatePartial(oldData => ({ ignoredUsers: [...oldData.ignoredUsers, ignoredUser.trim()] }))
      formApi.reset()
    }
  })
}
