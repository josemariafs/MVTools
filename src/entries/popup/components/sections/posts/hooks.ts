import { zodResolver } from '@hookform/resolvers/zod'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { type RefinementCtx, z } from 'zod'

import { STORAGE_KEYS } from '@/constants'
import { useMutate } from '@/entries/popup/hooks/use-mutate'
import { getPostsConfig, type PostsConfig, postsConfigSchema, setPostsConfig } from '@/services/config'
import { testApiKey } from '@/services/gemini'

export const postsConfigQueryOptions = queryOptions({
  queryKey: [STORAGE_KEYS.POSTS_CONFIG],
  queryFn: getPostsConfig
})

const validApiKeyTransform = async (value: string, ctx: RefinementCtx) => {
  if (!value) return value

  const validation = await testApiKey(value)
  if (!validation.ok) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: validation.status === 400 ? 'La API Key no es válida' : 'No se ha podido validar la API Key. Por favor, inténtalo de nuevo.'
    })
    return z.NEVER
  }
  return value
}

const postsFormConfigSchema = postsConfigSchema.extend({
  geminiApiKey: z.string().transform(validApiKeyTransform)
})

export const useMutatePostsConfig = () => useMutate(postsConfigQueryOptions.queryKey, setPostsConfig, true)
export const usePostsConfigForm = () => {
  const { data } = useSuspenseQuery(postsConfigQueryOptions)

  return useForm<PostsConfig>({
    resolver: zodResolver(postsFormConfigSchema),
    reValidateMode: 'onSubmit',
    defaultValues: data
  })
}
