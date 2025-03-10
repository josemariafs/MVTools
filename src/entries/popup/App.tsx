import { GeminiSection } from '@/entries/popup/components/sections/gemini'
import { PremiumStylesSection } from '@/entries/popup/components/sections/premium'

const App = () => {
  return (
    <main className='min-h-96 min-w-96 space-y-5 border-x-4 border-x-orange-500 p-7'>
      <PremiumStylesSection />
      <GeminiSection />
    </main>
  )
}

export default App
