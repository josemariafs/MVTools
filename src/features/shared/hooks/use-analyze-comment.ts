import { queryOptions, useQueries, useQuery } from '@tanstack/react-query'

import { analyzeComment, type AnalyzeCommentParams } from '@/services/gemini'

interface AnalyzeCommentQueryOptionsParams extends AnalyzeCommentParams {
  id: string | number
}

const analyzeCommentQueryOptions = <T>({ id, apiKey, model, action, comment }: AnalyzeCommentQueryOptionsParams) =>
  queryOptions<string, Error, T>({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps -- We don't need to add comment here as it is identified by the id
    queryKey: ['analyze-comment', id, model, action],
    queryFn: () => analyzeComment({ comment, action, apiKey, model }),
    enabled: false
  })

type AnalyzeCommentQueryOptions<T> = Partial<ReturnType<typeof analyzeCommentQueryOptions<T>>>

interface UseAnalyzeCommentParams<T> extends AnalyzeCommentQueryOptionsParams {
  options?: AnalyzeCommentQueryOptions<T>
}

export const useAnalyzeComment = <T = string>({ action, apiKey, model, comment, id, options }: UseAnalyzeCommentParams<T>) => {
  const defaultOptions = analyzeCommentQueryOptions<T>({ apiKey, model, id, comment, action })
  return useQuery({ ...defaultOptions, ...options })
}

interface UseAnalyzeCommentsParams<T> extends Pick<UseAnalyzeCommentParams<T>, 'apiKey' | 'model' | 'options'> {
  comments: Array<Pick<UseAnalyzeCommentParams<T>, 'comment' | 'id' | 'action'>>
}

export const useAnalyzeComments = <T = string>({ apiKey, model, comments, options }: UseAnalyzeCommentsParams<T>) => {
  const queries = comments.map(({ comment, id, action }) => {
    const defaultOptions = analyzeCommentQueryOptions<T>({ apiKey, model, id, comment, action })
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
