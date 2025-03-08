import '../enableDevHmr'
import '@/global.css'

import { Suspense } from '@suspensive/react'
import ReactDOM from 'react-dom/client'

import { TooltipProvider } from '@/components/ui/tooltip'
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

const root = document.getElementById('app')
root &&
  ReactDOM.createRoot(root).render(
    <DefaultQueryClientProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Suspense>
            <App />
          </Suspense>
        </TooltipProvider>
      </ThemeProvider>
    </DefaultQueryClientProvider>
  )
