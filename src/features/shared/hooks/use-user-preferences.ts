import { queryOptions, useQuery } from '@tanstack/react-query'

import { useMutate } from '@/hooks/use-mutate'
import { DEFAULT_USER_PREFERENCES, getUserPreferences, setUserPreferences } from '@/services/config'

const userPreferencesQueryOptions = queryOptions({
  queryKey: ['userPreferences'],
  queryFn: getUserPreferences,
  staleTime: Infinity
})

export const useUserPreferences = () => {
  const { data, isLoading, isError: isQueryError } = useQuery(userPreferencesQueryOptions)
  const { mutatePartial, isMutating, isError: isMutateError } = useMutate(userPreferencesQueryOptions.queryKey, setUserPreferences)
  const currentData = data ?? DEFAULT_USER_PREFERENCES

  return {
    ...currentData,
    isLoading: isLoading || isMutating,
    isError: isQueryError || isMutateError,
    setUserPreferences: mutatePartial
  }
}
