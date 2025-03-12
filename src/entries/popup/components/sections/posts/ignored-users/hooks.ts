import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { type IgnoredUsersFormData, ignoredUsersFormSchema } from '@/entries/popup/components/sections/posts/ignored-users/schema'

export const useIgnoredUsersForm = () =>
  useForm<IgnoredUsersFormData>({
    resolver: zodResolver(ignoredUsersFormSchema),
    defaultValues: {
      ignoredUser: ''
    }
  })
