import { ThemeContext } from '@/providers/theme-context'
import { createUseContext } from '@/utils/contexts'

export const useTheme = createUseContext(ThemeContext)
