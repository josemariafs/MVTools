import { ShadowRootContext } from '@/features/shared/providers/shadow-root-context'
import { createContextProvider } from '@/utils/contexts'

export const ShadowRootProvider = createContextProvider(ShadowRootContext)
