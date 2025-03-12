import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'

import { STORAGE_KEYS } from '@/constants'
import { useMutate } from '@/entries/popup/hooks/use-mutate'
import { getPostsConfig, setPostsConfig } from '@/services/config'

export const postsConfigQueryOptions = queryOptions({
  queryKey: [STORAGE_KEYS.POSTS_CONFIG],
  queryFn: getPostsConfig
})

export const usePostsConfig = () => useSuspenseQuery(postsConfigQueryOptions)
export const useMutatePostsConfig = ({ toast = false }: { toast?: boolean } = {}) =>
  useMutate(postsConfigQueryOptions.queryKey, setPostsConfig, toast)
