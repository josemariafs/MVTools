import '../enableDevHmr'
import '@/global.css'

import { Suspense } from '@suspensive/react'
import ReactDOM from 'react-dom/client'

import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { postsConfigQueryOptions } from '@/entries/popup/components/sections/posts/hooks'
import { stylesConfigQueryOptions } from '@/entries/popup/components/sections/styles/hooks'
import { defaultQueryClient, DefaultQueryClientProvider } from '@/providers/query-client-provider'
import { ThemeProvider } from '@/providers/theme-provider'

import App from './App'

defaultQueryClient.prefetchQuery(stylesConfigQueryOptions)
defaultQueryClient.prefetchQuery(postsConfigQueryOptions)

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
