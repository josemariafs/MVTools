import { useGlobalConfig, useMutateGlobalConfig } from '@/entries/popup/components/sections/posts/hooks'
import { getIgnoredUsersSchema } from '@/entries/popup/components/sections/posts/ignored-users/schema'
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
