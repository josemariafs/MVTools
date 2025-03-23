import { ShadowRootContext } from '@/features/shared/providers/shadow-root-context'
import { createUseContext } from '@/utils/contexts'

export const useShadowRoot = createUseContext(ShadowRootContext)
