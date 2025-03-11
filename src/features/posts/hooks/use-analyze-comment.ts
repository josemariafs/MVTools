import { queryOptions, useQuery } from '@tanstack/react-query'

import { usePostContext } from '@/features/posts/providers/post-context-provider'
import { type Action, analyzeComment, type AnalyzeCommentParams } from '@/services/gemini'

interface QueryOptionsParams extends AnalyzeCommentParams {
  id: string
}

const analyzeCommentQueryOptions = <T>({ id, apiKey, action, comment }: QueryOptionsParams) =>
  queryOptions<string, Error, T>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps -- We only need to pass the id and action as a dependency
    queryKey: ['analyze-comment', id, action],
    queryFn: () => analyzeComment({ comment, action, apiKey }),
    enabled: false
  })

type AnalyzeCommentQueryOptions<T> = Partial<ReturnType<typeof analyzeCommentQueryOptions<T>>>

interface Props<T> {
  action: Action
  apiKey: string
  options?: AnalyzeCommentQueryOptions<T>
}

export const useAnalyzeComment = <T = string>({ action, apiKey, options }: Props<T>) => {
  const { id, comment } = usePostContext()
  const defaultOptions = analyzeCommentQueryOptions<T>({ apiKey, id, comment, action })
  return useQuery({ ...defaultOptions, ...options })
}
