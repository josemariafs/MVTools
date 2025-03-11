import { z } from 'zod'

import { getStoredProperty, setStoredProperty } from '@/services/storage'

import { DEFAULT_POSTS_CONFIG, STORAGE_KEYS } from '../constants'

export const postsConfigSchema = z.object({
  geminiApiKey: z.string(),
  ignoredUsers: z.array(z.string()),
  showIgnoredUsers: z.boolean(),
  userNotes: z.array(z.object({ username: z.string(), note: z.string() })),
  highlightedUsers: z.array(z.string())
})

export type PostsConfig = z.infer<typeof postsConfigSchema>

export const getPostsConfig = () => getStoredProperty<PostsConfig>(STORAGE_KEYS.POSTS_CONFIG, DEFAULT_POSTS_CONFIG)
export const setPostsConfig = (value: PostsConfig) => setStoredProperty(STORAGE_KEYS.POSTS_CONFIG, value)

export const stylesConfigSchema = z.object({
  premiumEnabled: z.boolean(),
  premiumBgDisabled: z.boolean(),
  ultraWideEnabled: z.boolean()
})

export type StylesConfig = z.infer<typeof stylesConfigSchema>

export const getStylesConfig = () =>
  getStoredProperty<StylesConfig>(STORAGE_KEYS.STYLES_CONFIG, {
    premiumEnabled: false,
    premiumBgDisabled: false,
    ultraWideEnabled: false
  })

export const setStylesConfig = (value: StylesConfig) => setStoredProperty(STORAGE_KEYS.STYLES_CONFIG, value)

export const getAllStorageConfigs = () =>
  Promise.all([getStylesConfig(), getPostsConfig()]).then(([stylesConfig, postsConfig]) => ({
    [STORAGE_KEYS.STYLES_CONFIG]: stylesConfig,
    [STORAGE_KEYS.POSTS_CONFIG]: postsConfig
  }))
