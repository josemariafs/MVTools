import { Separator } from '@/components/ui/separator'
import { Form as AnnotatedUsersForm } from '@/entries/popup/components/sections/posts/annotated-users/form'
import { Form as GeminiForm } from '@/entries/popup/components/sections/posts/gemini/form'
import { Form as HighlightedUsersForm } from '@/entries/popup/components/sections/posts/highlighted-users/form'
import { Form as IgnoredUsersForm } from '@/entries/popup/components/sections/posts/ignored-users/form'
import { ShowIgnoredUsersSwitch } from '@/entries/popup/components/sections/posts/ignored-users/show-ignored-users-switch'

export const PostsSection = () => {
  return (
    <section>
      <header className='flex items-center gap-2.5 pb-2'>
        <h1 className='text-xl font-bold text-orange-500'>Post tweaks</h1>
      </header>
      <main className='items-center justify-between space-y-3 rounded-lg border p-3 shadow-sm'>
        <GeminiForm />
        <Separator />
        <IgnoredUsersForm />
        <ShowIgnoredUsersSwitch />
        <Separator />
        <AnnotatedUsersForm />
        <Separator />
        <HighlightedUsersForm />
      </main>
    </section>
  )
}
