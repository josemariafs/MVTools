import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import {
  type HighlightedUsersFormData,
  highlightedUsersFormSchema
} from '@/entries/popup/components/sections/posts/highlighted-users/schema'

export const useHighlightedUsersForm = () =>
  useForm<HighlightedUsersFormData>({
    resolver: zodResolver(highlightedUsersFormSchema),
    defaultValues: {
      highlightedUser: ''
    }
  })
