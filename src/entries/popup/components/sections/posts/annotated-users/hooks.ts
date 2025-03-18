import { useAppForm } from '@/components/ui/form'
import { getAnnotatedUsersSchema } from '@/entries/popup/components/sections/posts/annotated-users/schema'
import { useGlobalConfig, useMutateGlobalConfig } from '@/entries/popup/components/sections/posts/hooks'

export const useAnnotatedUsersForm = () => {
  const { data } = useGlobalConfig()
  const { mutatePartial } = useMutateGlobalConfig()
  return useAppForm({
    defaultValues: {
      username: '',
      note: ''
    },
    validators: {
      onSubmitAsync: getAnnotatedUsersSchema(data)
    },
    onSubmit: ({ value, formApi }) => {
      mutatePartial({ userNotes: [...data.userNotes, value] })
      formApi.reset()
    }
  })
}
