import '@/entries/enableDevHmr'
import '@/entries/popup/popup.css'

import { Suspense } from '@suspensive/react'
import ReactDOM from 'react-dom/client'

import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { defaultQueryClient } from '@/constants/tanstack'
import { stylesConfigQueryOptions } from '@/entries/popup/components/sections/styles/index.hooks'
import { globalConfigQueryOptions } from '@/entries/popup/hooks/use-global-config'
import { DefaultQueryClientProvider } from '@/providers/query-client-provider'
import { ThemeProvider } from '@/providers/theme-provider'

import App from './App'

defaultQueryClient.prefetchQuery(stylesConfigQueryOptions)
defaultQueryClient.prefetchQuery(globalConfigQueryOptions)

const root = document.getElementById('app')
root &&
  ReactDOM.createRoot(root).render(
    <DefaultQueryClientProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Suspense>
            <Toaster closeButton />
            <App />
          </Suspense>
        </TooltipProvider>
      </ThemeProvider>
    </DefaultQueryClientProvider>
  )
