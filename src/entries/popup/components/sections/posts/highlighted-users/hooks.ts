import { useAppForm } from '@/components/ui/form'
import { getHighlightedUsersSchema } from '@/entries/popup/components/sections/posts/highlighted-users/schema'
import { useGlobalConfig, useMutateGlobalConfig } from '@/entries/popup/components/sections/posts/hooks'

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
      mutatePartial({ highlightedUsers: [...data.highlightedUsers, highlightedUser] })
      formApi.reset()
    }
  })
}
