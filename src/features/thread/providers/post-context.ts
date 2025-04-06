import { createContext } from 'react'

import type { PostElements } from '@/types/media-vida'

export const PostContext = createContext<PostElements | null>(null)
