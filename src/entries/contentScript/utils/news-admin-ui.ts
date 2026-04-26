import { devLog } from '@/utils/logging'

const CLASS_NAME = 'mvNewsAdminUI'

function pathMatchesNewsAdmin(): boolean {
  const p = window.location.pathname.toLowerCase()
  if (p.includes('admin_noticias')) return true
  if (p.includes('/noticias/') && p.includes('admin')) return true
  if (p.includes('noticias') && p.includes('slider')) return true
  if (p.includes('/portada/slider')) return true
  if (p.includes('/portada/') && p.includes('admin')) return true
  return false
}

function domMatchesNewsAdmin(): boolean {
  const text = document.body.innerText
  if (!text.includes('Nuevo slide')) return false
  const hasCrearPantalla = [...document.querySelectorAll('button, a[role="button"]')].some(el =>
    (el.textContent ?? '').includes('Crear esta pantalla')
  )
  if (hasCrearPantalla) return true
  // Variantes o pestaña cargada con retraso: slider + carga desde noticia
  return text.includes('Cargar desde noticia') && text.includes('URL del enlace')
}

export function markNewsAdminUiIfNeeded(): void {
  if (document.body.classList.contains(CLASS_NAME)) return
  if (pathMatchesNewsAdmin() || domMatchesNewsAdmin()) {
    document.body.classList.add(CLASS_NAME)
    devLog.log('news-admin-ui: estilos de legibilidad (mvNewsAdminUI)')
  }
}

/**
 * Ruta, DOM inicial y contenido retrasado (pestañas, fragmentos) para asegurar la clase.
 */
export function scheduleNewsAdminUiMarking(): void {
  const run = () => {
    markNewsAdminUiIfNeeded()
  }
  run()
  requestAnimationFrame(run)
  for (const ms of [50, 200, 500, 1200, 2500]) {
    setTimeout(run, ms)
  }

  if (typeof MutationObserver === 'undefined') return
  const obs = new MutationObserver(() => {
    if (document.body.classList.contains(CLASS_NAME)) {
      obs.disconnect()
    } else if (pathMatchesNewsAdmin() || domMatchesNewsAdmin()) {
      document.body.classList.add(CLASS_NAME)
      devLog.log('news-admin-ui: activado vía observer')
      obs.disconnect()
    }
  })
  obs.observe(document.body, { childList: true, subtree: true })
  setTimeout(() => {
    obs.disconnect()
  }, 10_000)
}
