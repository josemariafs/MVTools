import '../enableDevHmr'
import '@/global.css'

import ReactDOM from 'react-dom/client'

import { DefaultQueryClientProvider } from '@/providers/query-client-provider'
import { ThemeProvider } from '@/providers/theme-provider'

import App from './App'

const root = document.getElementById('app')
root &&
  ReactDOM.createRoot(root).render(
    <DefaultQueryClientProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </DefaultQueryClientProvider>
  )
