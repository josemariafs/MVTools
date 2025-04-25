import '@/entries/enableDevHmr'
import '@/entries/contentScript/content-script.css'

import { devLog } from '@/utils/logging'

devLog.log('Rendering clones page')

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

const allForms = document.querySelectorAll('form')
const secondForm = allForms.length > 1 ? allForms[1]! : null

// --- If the second form exists, insert the new fieldset after it ---
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
