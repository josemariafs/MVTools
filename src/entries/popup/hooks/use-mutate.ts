import { type MutationFunction, type QueryKey, useIsMutating, useMutation, useQueryClient } from '@tanstack/react-query'

export const useMutate = <T>(queryKey: QueryKey, mutationFn: MutationFunction<void, T>) => {
  const isMutating = useIsMutating({ mutationKey: queryKey }) > 0
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationKey: queryKey,
    mutationFn,
    onSuccess: (_data, variables) => {
      queryClient.setQueryData(queryKey, variables)
    }
  })

  return {
    ...mutation,
    isMutating
  }
}
