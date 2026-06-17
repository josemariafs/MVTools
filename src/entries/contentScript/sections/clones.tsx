import '@/entries/enableDevHmr'
import '@/entries/contentScript/content-script.css'

import {
  addTrackedCloneAccount,
  isCloneAccountTracked,
  parseClonesPageMeta,
  removeTrackedCloneAccount,
  type TrackedCloneAccount
} from '@/services/clone-tracking'
import { devLog } from '@/utils/logging'

devLog.log('Rendering clones page')

const TRACKING_BTN_ID = 'mv-track-clones'
const TRACK_BTN_CLASS = 'mv-clones-track-btn'
const HEADING_CLASS = 'mv-clones-heading'
const HEADING_ROW_CLASS = 'mv-clones-title-row'

// --- Adding page styles ---
document.body.classList.add('mvAdminTools')

const eqcolElements = document.querySelectorAll<HTMLElement>('.eqcol')
eqcolElements.forEach(element => {
  if (element.classList.length === 1) {
    element.classList.add('busted')
  }
})

// --- Replace status tags with custom HTML ---
const listItemElements = document.querySelectorAll<HTMLLIElement>('ul li')
listItemElements.forEach(li => {
  let currentHtml = li.innerHTML
  let htmlChanged = false

  const replacements: Record<string, string> = {
    '<strong>b</strong>': "<span style='background: #af2727;padding: 1px 5px;border-radius: 5px;'>BANNED</span>",
    '<strong>p</strong>': "<span style='background:rgb(52 88 143);padding: 1px 5px;border-radius: 5px;'>Sanción activa</span>",
    '<strong>d</strong>': "<span style='background:rgb(45, 45, 45);padding: 1px 5px;border-radius: 5px;'>Cuenta desactivada</span>"
  }

  for (const [key, value] of Object.entries(replacements)) {
    if (currentHtml.includes(key)) {
      currentHtml = currentHtml.replace(key, value)
      htmlChanged = true
    }
  }

  if (htmlChanged) {
    li.innerHTML = currentHtml
  }
})

// --- Hide IPs without clones based on localStorage ---
const showIpsWithoutClonesSetting = window.localStorage.getItem('showIpsWithoutClons')

if (showIpsWithoutClonesSetting === 'false') {
  const boxContainer = document.querySelector<HTMLElement>('.box')
  if (boxContainer) {
    const divsInBox = boxContainer.querySelectorAll<HTMLDivElement>('div')
    divsInBox.forEach(div => {
      if (div.textContent?.includes('ninguno')) {
        div.style.display = 'none'
      }
    })
  } else {
    console.warn("Advertencia: No se encontró el contenedor '.box' para ocultar IPs.")
  }
}

const pageMeta = parseClonesPageMeta(document, window.location.href)

function findClonesHeading(): HTMLElement | null {
  return (
    document.querySelector<HTMLElement>('h1') ??
    document.querySelector<HTMLElement>('.sp h3') ??
    Array.from(document.querySelectorAll<HTMLElement>('h2, h3, h4')).find(h => /clones de/i.test(h.textContent ?? '')) ??
    null
  )
}

function ensureHeadingStructure(heading: HTMLElement, username: string): HTMLElement | null {
  if (!/clones de/i.test(heading.textContent ?? '')) return null

  let row = heading.parentElement
  if (!row?.classList.contains(HEADING_ROW_CLASS)) {
    const wrapper = document.createElement('div')
    wrapper.className = HEADING_ROW_CLASS
    heading.parentNode?.insertBefore(wrapper, heading)
    wrapper.appendChild(heading)
    row = wrapper
  }

  heading.classList.add(HEADING_CLASS)

  let userSpan = heading.querySelector<HTMLElement>('.mv-clones-heading-user')
  if (!userSpan) {
    heading.textContent = ''
    const prefix = document.createElement('span')
    prefix.textContent = 'Clones de '
    userSpan = document.createElement('span')
    userSpan.className = 'mv-clones-heading-user'
    userSpan.textContent = username
    heading.append(prefix, userSpan)
  } else {
    userSpan.textContent = username
  }

  return userSpan
}

async function mountTrackingButton(meta: TrackedCloneAccount): Promise<boolean> {
  if (document.getElementById(TRACKING_BTN_ID)) return true

  const heading = findClonesHeading()
  if (!heading) return false

  const userSpan = ensureHeadingStructure(heading, meta.username)
  if (!userSpan) return false

  const tracked = await isCloneAccountTracked(meta.userId)

  const button = document.createElement('button')
  button.type = 'button'
  button.id = TRACKING_BTN_ID
  button.className = TRACK_BTN_CLASS
  button.dataset.tracked = tracked ? 'true' : 'false'
  button.textContent = tracked ? 'Quitar del seguimiento' : 'Añadir a seguimiento'

  button.addEventListener('click', async () => {
    button.disabled = true
    try {
      const isTracked = await isCloneAccountTracked(meta.userId)
      if (isTracked) {
        await removeTrackedCloneAccount(meta.userId)
        button.textContent = 'Añadir a seguimiento'
        button.dataset.tracked = 'false'
      } else {
        await addTrackedCloneAccount(meta)
        button.textContent = 'Quitar del seguimiento'
        button.dataset.tracked = 'true'
      }
    } finally {
      button.disabled = false
    }
  })

  userSpan.insertAdjacentElement('afterend', button)
  devLog.log('clone-tracking: botón montado junto al nickname')
  return true
}

function bootstrapTrackingButton(): void {
  if (!pageMeta) {
    devLog.log('clone-tracking: no se pudo resolver id/username de la página')
    return
  }

  void mountTrackingButton(pageMeta).then(mounted => {
    if (mounted) return

    let attempts = 0
    const retry = window.setInterval(() => {
      attempts += 1
      void mountTrackingButton(pageMeta).then(ok => {
        if (ok || attempts >= 20) window.clearInterval(retry)
      })
    }, 200)
  })
}

bootstrapTrackingButton()

const allForms = document.querySelectorAll('form')
const secondForm = allForms.length > 1 ? allForms[1]! : null

// --- If the second form exists, insert the IP toggle after it ---
if (secondForm?.parentNode) {
  const showIpsIsEnabled = window.localStorage.getItem('showIpsWithoutClons') === 'true'
  const newFieldset = document.createElement('fieldset')

  newFieldset.innerHTML = `
    <div style=" background: rgba(0, 0, 0, 0.5) !important; width: max-content; padding: 0 25px; border-radius: 0 0 0 10px; height: 40px; float: left;">
        <div class="control-label" style="margin-bottom: 20px;">
            <h4>Mostrar IPs sin clones</h4>
        </div>
        <div class="control-input">
            <label class="switch" for="show-all-ips">
                <input type="checkbox" id="show-all-ips" ${showIpsIsEnabled ? 'checked' : ''}>
                <div class="slider round"></div>
            </label>
        </div>
    </div>
    <div style=" background: rgba(0, 0, 0, 0.5) !important; width: max-content; padding: 0 25px; border-radius: 0 0 10px 0; height: 40px; float: left;">
        </div>
`
  secondForm.insertAdjacentElement('afterend', newFieldset)

  const checkbox = newFieldset.querySelector<HTMLInputElement>('#show-all-ips')
  if (checkbox) {
    checkbox.addEventListener('change', () => {
      window.localStorage.setItem('showIpsWithoutClons', checkbox.checked.toString())
      location.reload()
    })
  }
}
