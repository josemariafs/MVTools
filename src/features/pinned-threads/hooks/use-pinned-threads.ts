import { PinnedThreadsContext } from '@/features/pinned-threads/providers/pinned-threads-context'
import { createUseContext } from '@/utils/contexts'

export const usePinnedThreads = createUseContext(PinnedThreadsContext)
