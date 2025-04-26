import type { CheckedState } from '@radix-ui/react-checkbox'
import { type PropsWithChildren, useMemo, useState } from 'react'

import { PinnedThreadsContext, type PinnedThreadsData } from '@/features/pinned-threads/providers/pinned-threads-context'

export const PinnedThreadsProvider = ({ children, ...rest }: PropsWithChildren<Omit<PinnedThreadsData, 'allChecked'>>) => {
  const [allChecked, setAllChecked] = useState<CheckedState>(false)

  const data = useMemo(
    () => ({
      allChecked: {
        setState: setAllChecked,
        state: allChecked
      },
      ...rest
    }),
    [rest]
  )

  return <PinnedThreadsContext value={data}>{children}</PinnedThreadsContext>
}
