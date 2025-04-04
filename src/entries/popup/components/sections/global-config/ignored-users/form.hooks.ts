import { getIgnoredUsersSchema } from '@/entries/popup/components/sections/global-config/ignored-users/schema'
import { useGlobalConfig, useMutateGlobalConfig } from '@/entries/popup/hooks/use-global-config'
import { useAppForm } from '@/hooks/use-form'

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
      mutatePartial({ ignoredUsers: [...data.ignoredUsers, ignoredUser] })
      formApi.reset()
    }
  })
}
