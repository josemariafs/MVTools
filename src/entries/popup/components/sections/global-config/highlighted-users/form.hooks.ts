import { getHighlightedUsersSchema } from '@/entries/popup/components/sections/global-config/highlighted-users/schema'
import { useGlobalConfig, useMutateGlobalConfig } from '@/entries/popup/hooks/use-global-config'
import { useAppForm } from '@/hooks/use-form'

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
