import { useAppForm } from '@/components/ui/form'
import { useMutatePostsConfig, usePostsConfig } from '@/entries/popup/components/sections/posts/hooks'
import { getIgnoredUsersSchema } from '@/entries/popup/components/sections/posts/ignored-users/schema'

export const useIgnoredUsersForm = () => {
  const { data } = usePostsConfig()
  const { mutatePartial } = useMutatePostsConfig()

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
