import { type MutationFunction, type QueryKey, useIsMutating, useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { toast } from 'sonner'

export const useMutate = <T>(queryKey: QueryKey, mutationFn: MutationFunction<void, T>, sendToast = false) => {
  const isMutating = useIsMutating({ mutationKey: queryKey }) > 0
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationKey: queryKey,
    mutationFn,
    onSuccess: (_data, variables) => {
      queryClient.setQueryData(queryKey, variables)
      sendToast && toast.success('Datos guardados correctamente')
    }
  })

  const mutatePartial = useCallback(
    (partial: Partial<T> | ((oldData: T) => Partial<T>)) => {
      const oldData = queryClient.getQueryData<T>(queryKey)!
      const newPartial = typeof partial === 'function' ? partial(oldData) : partial
      mutation.mutate({ ...oldData, ...newPartial })
    },
    [mutation.mutate, queryClient, queryKey]
  )

  return {
    ...mutation,
    mutatePartial,
    isMutating
  }
}
