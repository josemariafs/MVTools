import { NewPopupButton } from '@/entries/popup/components/NewPopupButton'
import { PostsSection } from '@/entries/popup/components/sections/posts'
import { StylesSection } from '@/entries/popup/components/sections/styles'

const App = () => {
  return (
    <main className='relative flex h-full min-h-96 min-w-96 space-y-5 border-x-4 border-x-orange-500 p-7'>
      <NewPopupButton />
      <StylesSection />
      <PostsSection />
    </main>
  )
}

export default App
