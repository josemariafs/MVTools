import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { type AnnotatedUsersFormData, annotatedUsersFormSchema } from '@/entries/popup/components/sections/posts/annotated-users/schema'

export const useAnnotatedUsersForm = () =>
  useForm<AnnotatedUsersFormData>({
    resolver: zodResolver(annotatedUsersFormSchema),
    defaultValues: {
      username: '',
      note: ''
    }
  })
