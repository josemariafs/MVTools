import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { type FormData, formSchema } from '@/entries/popup/components/config-form/schema'

export const useConfigForm = () => {
  return useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: ''
    }
  })
}
