import { createContext } from 'react'

import type { PostElements } from '@/services/media-vida'

export const PostContext = createContext<PostElements | null>(null)
