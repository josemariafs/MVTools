import { useEffect, useMemo } from 'react'

import mcGif from '@/assets/mc.gif'
import { Portal } from '@/features/shared/components/portal'
import { getClonesElements } from '@/services/media-vida'
import { getAssetUrl, toggleStyle } from '@/utils/dom'
import { cn } from '@/utils/tailwind'

export const Clones = () => {
  const { clonesHeader, clonesList, contentContainer, mainContainer, currentQueriesText, cantTouchThis } = useMemo(getClonesElements, [])

  useEffect(() => {
    const isDevMode = import.meta.env.MODE !== 'production'
    isDevMode ? toggleStyle(contentContainer, true, { display: 'none' }) : contentContainer.remove()
  }, [])

  return (
    <Portal
      root={mainContainer}
      styles={{ margin: '0 -12px' }}
    >
      {cantTouchThis && (
        <img
          className='h-48 pt-5'
          src={getAssetUrl(mcGif)}
          alt='MC Gif'
        />
      )}
      <p className={cn('pt-5', cantTouchThis && 'font-bold text-sm')}>{currentQueriesText}</p>
      {clonesHeader && <h3 className='pt-5 text-lg font-semibold'>{clonesHeader}</h3>}
      <ul>
        {clonesList.map(({ nick, href, text, badge }) => (
          <li key={href}>
            <a
              className='text-[#fc8f22] no-underline'
              href={href}
            >
              {nick}
            </a>{' '}
            {text} {badge && <span className={`${badge.twBg} rounded-[5px] px-[5px] py-px`}>{badge.text}</span>}
          </li>
        ))}
      </ul>
    </Portal>
  )
}
