import { MarkersContext } from '@/features/markers/providers/markers-context'
import { createContextProvider } from '@/utils/contexts'

export const MarkersProvider = createContextProvider(MarkersContext)
