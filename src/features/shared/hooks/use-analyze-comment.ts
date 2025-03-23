import { queryOptions, useQueries, useQuery } from '@tanstack/react-query'

import { type Action, analyzeComment, type AnalyzeCommentParams } from '@/services/gemini'

interface QueryOptionsParams extends AnalyzeCommentParams {
  id: string | number
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
  comment: string
  id: string | number
  options?: AnalyzeCommentQueryOptions<T>
}

export const useAnalyzeComment = <T = string>({ action, apiKey, comment, id, options }: Props<T>) => {
  const defaultOptions = analyzeCommentQueryOptions<T>({ apiKey, id, comment, action })
  return useQuery({ ...defaultOptions, ...options })
}

interface Comment {
  comment: string
  id: string | number
  action: Action
}

export const useAnalyzeComments = <T = string>({
  apiKey,
  comments,
  options
}: {
  apiKey: string
  comments: Comment[]
  options?: AnalyzeCommentQueryOptions<T>
}) => {
  const queries = comments.map(({ comment, id, action }) => {
    const defaultOptions = analyzeCommentQueryOptions<T>({ apiKey, id, comment, action })
    return { ...defaultOptions, ...options }
  })

  return useQueries({
    queries,
    combine: results => ({
      pending: results.some(result => result.isFetching),
      refetch: () => {
        results.forEach(result => result.refetch())
      }
    })
  })
}
