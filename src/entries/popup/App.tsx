import { PostsSection } from '@/entries/popup/components/sections/posts'
import { StylesSection } from '@/entries/popup/components/sections/styles'

const App = () => {
  return (
    <main className='min-h-96 min-w-96 space-y-5 border-x-4 border-x-orange-500 p-7'>
      <StylesSection />
      <PostsSection />
    </main>
  )
}

export default App
