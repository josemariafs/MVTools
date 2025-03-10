import '../enableDevHmr'
import '@/global.css'

import { Suspense } from '@suspensive/react'
import ReactDOM from 'react-dom/client'

import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { geminiApiKeyQueryOptions } from '@/entries/popup/components/sections/gemini/hooks'
import {
  backgroundDisabledQueryOptions,
  premiumEnabledQueryOptions,
  ultraWideEnabledQueryOptions
} from '@/entries/popup/components/sections/premium/hooks'
import { defaultQueryClient, DefaultQueryClientProvider } from '@/providers/query-client-provider'
import { ThemeProvider } from '@/providers/theme-provider'

import App from './App'

defaultQueryClient.prefetchQuery(premiumEnabledQueryOptions)
defaultQueryClient.prefetchQuery(backgroundDisabledQueryOptions)
defaultQueryClient.prefetchQuery(ultraWideEnabledQueryOptions)
defaultQueryClient.prefetchQuery(geminiApiKeyQueryOptions)

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
