import { getAnnotatedUsersSchema } from '@/entries/popup/components/sections/global-config/annotated-users/schema'
import { useAppForm } from '@/entries/popup/hooks/use-form'
import { useGlobalConfig, useMutateGlobalConfig } from '@/entries/popup/hooks/use-global-config'

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
