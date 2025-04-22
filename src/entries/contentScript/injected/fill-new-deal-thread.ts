import { CSS_SELECTORS } from '@/constants'
import type { InjectDealScriptPayload } from '@/types/event-messages'

const { TITLE, DESCRIPTION, CATEGORY, OTHER_CATEGORY_OPTION } = CSS_SELECTORS.NEW_THREAD

type ScriptWindow = Window &
  typeof globalThis & {
    deal: InjectDealScriptPayload['deal']
  }

const { deal } = window as ScriptWindow
const { title, price, link, description, dealImgUrl, voucher } = deal

const titleInput = document.querySelector<HTMLInputElement>(TITLE)
if (titleInput) {
  titleInput.value = `${title} | ${price}`
}

const otrosCategoryOption = document.querySelector<HTMLOptionElement>(`${CATEGORY} > ${OTHER_CATEGORY_OPTION}`)
if (otrosCategoryOption) {
  otrosCategoryOption.selected = true
}

const descriptionInput = document.querySelector<HTMLInputElement>(DESCRIPTION)
if (descriptionInput) {
  descriptionInput.value = getDescription()
}

function getDescription() {
  const descriptionTemplate = `
# ${title}
[img]${dealImgUrl}[/img]

# Precio
${price} ${voucher ? `| [b]Código de descuento:[/b] ${voucher}` : ''}

# Enlace a la oferta
[url=${link}][img]https://i.imgur.com/2yNDQ4S.png[/img][/url]

# Descripción
${description}
`
  return descriptionTemplate.trim()
}
