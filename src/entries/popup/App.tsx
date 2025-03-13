import { NewPopupButton } from '@/entries/popup/components/NewPopupButton'
import { PostsSection } from '@/entries/popup/components/sections/posts'
import { StylesSection } from '@/entries/popup/components/sections/styles'

const App = () => {
  return (
    <main className='h-maxPopupHeight relative border-x-4 border-x-orange-500 p-7'>
      <NewPopupButton />
      <div className='space-y-5'>
        <StylesSection />
        <PostsSection />
      </div>
    </main>
  )
}

export default App
