import TurndownService from 'turndown'

import { CSS_SELECTORS } from '@/constants'
const { MAIN_CONTAINER, DESCRIPTION, DEAL_IMG, THREAD_TITLE, THREAD_PRICE, VOUCHER_INPUT, GET_DEAL_BUTTON } = CSS_SELECTORS.CHOLLOMETRO

const getThreadLink = () => {
  const threadJsonString = document.querySelector<HTMLElement>(MAIN_CONTAINER)?.dataset.tD
  if (!threadJsonString) return ''

  const threadObject = JSON.parse(threadJsonString) as { threadId: string }
  return `https://www.chollometro.com/visit/threadmain/${threadObject.threadId}`
}

const getDescription = () => {
  const description = document.querySelector(DESCRIPTION)?.innerHTML
  if (!description) return ''

  return new TurndownService().turndown(description)
}

const getDealImgUrl = () => {
  const srcImgDeal = document.querySelector<HTMLImageElement>(DEAL_IMG)?.src
  if (!srcImgDeal) return ''

  return srcImgDeal.replace(/\s|1x|2x/g, '')
}

export const getDealData = () => ({
  buttonContainer: document.querySelector<HTMLElement>(GET_DEAL_BUTTON)?.parentElement ?? undefined,
  title: document.querySelector(THREAD_TITLE)?.textContent ?? '',
  price: document.querySelector(THREAD_PRICE)?.textContent ?? '',
  voucher: document.querySelector<HTMLInputElement>(VOUCHER_INPUT)?.value,
  description: getDescription(),
  link: getThreadLink(),
  dealImgUrl: getDealImgUrl()
})
