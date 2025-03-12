import { CSS_CLASS_NAMES, STORAGE_KEYS, type StorageKey } from '@/constants'
import { renderPosts } from '@/features/posts/main'
import { postsConfigSchema, stylesConfigSchema } from '@/services/config'
import { updatePostsConfigStore } from '@/store/posts-config-store'
import { objectEntries } from '@/utils/asserts'
import { toggleClass } from '@/utils/dom'
import { devLog } from '@/utils/logging'

const { MV_PREMIUM, MV_PREMIUM_WITHOUT_BG, MV_ULTRA_WIDE } = CSS_CLASS_NAMES

export const toggleStylesAction = (value: unknown) => {
  const validStylesConfig = stylesConfigSchema.safeParse(value)
  if (!validStylesConfig.success) return

  devLog.log('Styles config updated:', validStylesConfig.data)
  objectEntries(validStylesConfig.data).forEach(([key, value]) => {
    key === 'premiumEnabled' && toggleClass(MV_PREMIUM, value)
    key === 'premiumBgDisabled' && toggleClass(MV_PREMIUM_WITHOUT_BG, value)
    key === 'ultraWideEnabled' && toggleClass(MV_ULTRA_WIDE, value)
  })
}

export const updatePostsAction = (value: unknown) => {
  const validPostsConfig = postsConfigSchema.safeParse(value)
  if (!validPostsConfig.success) return

  devLog.log('Posts config updated:', validPostsConfig.data)
  updatePostsConfigStore(validPostsConfig.data)
}

export const renderPostsAction = (value: unknown) => {
  const validPostsConfig = postsConfigSchema.safeParse(value)
  if (!validPostsConfig.success) return

  devLog.log('Rendering Posts with:', validPostsConfig.data)
  updatePostsConfigStore(validPostsConfig.data)
  renderPosts()
}

export const INIT_STORAGE_ACTIONS: Record<StorageKey, (value: unknown) => void> = {
  [STORAGE_KEYS.STYLES_CONFIG]: toggleStylesAction,
  [STORAGE_KEYS.POSTS_CONFIG]: renderPostsAction
} as const

export const UPDATE_STORAGE_ACTIONS: Record<StorageKey, (value: unknown) => void> = {
  [STORAGE_KEYS.STYLES_CONFIG]: toggleStylesAction,
  [STORAGE_KEYS.POSTS_CONFIG]: updatePostsAction
}
