import { NewPopupButton } from '@/entries/popup/components/new-popup-button'
import { PostsSection } from '@/entries/popup/components/sections/posts'
import { StylesSection } from '@/entries/popup/components/sections/styles'

const App = () => {
  return (
    <main className='min-h-maxPopupHeight relative h-screen min-w-[500px] overflow-auto border-x-4 border-x-orange-500 p-7'>
      <NewPopupButton />
      <div className='space-y-5'>
        <StylesSection />
        <PostsSection />
      </div>
    </main>
  )
}

export default App
