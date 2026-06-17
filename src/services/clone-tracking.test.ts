/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'

import {
  findBustedSection,
  parseClonesPageMeta,
  parseNonBannedBustedRows
} from '@/services/clone-tracking-parse'

const parseHtml = (html: string) => new DOMParser().parseFromString(html, 'text/html')

describe('clone-tracking', () => {
  it('detecta filas no baneadas en tabla Busted', () => {
    const doc = parseHtml(`
      <div class="eqcol">
        <h4>Busted</h4>
        <table>
          <thead>
            <tr><th>Nombre</th><th>Fecha</th><th>Estado</th></tr>
          </thead>
          <tbody>
            <tr><td>Lunaru</td><td>8 May 26</td><td>baneado</td></tr>
            <tr><td>Leh</td><td>8 May 26</td><td>activo</td></tr>
          </tbody>
        </table>
      </div>
    `)

    expect(parseNonBannedBustedRows(doc)).toEqual([{ label: 'Leh', status: 'activo' }])
  })

  it('ignora filas baneadas en tabla Busted', () => {
    const doc = parseHtml(`
      <div class="eqcol">
        <h4>Busted</h4>
        <table>
          <thead><tr><th>Nombre</th><th>Estado</th></tr></thead>
          <tbody>
            <tr><td>Lunaru</td><td>baneado</td></tr>
            <tr><td>Leh</td><td>Baneado</td></tr>
          </tbody>
        </table>
      </div>
    `)

    expect(parseNonBannedBustedRows(doc)).toEqual([])
  })

  it('detecta cuentas con sanción activa en listas ul/li', () => {
    const doc = parseHtml(`
      <div class="eqcol">
        <h4>Busted</h4>
        <ul>
          <li><a href="#">CuentaA</a> <strong>b</strong></li>
          <li><a href="#">CuentaB</a> <strong>p</strong></li>
        </ul>
      </div>
    `)

    expect(parseNonBannedBustedRows(doc)).toEqual([{ label: 'CuentaB', status: 'sanción activa' }])
  })

  it('localiza la sección Busted por encabezado', () => {
    const doc = parseHtml(`
      <div class="eqcol"><h4>IPs con clones</h4></div>
      <div class="eqcol"><h4>Busted</h4><table></table></div>
    `)

    const section = findBustedSection(doc)
    expect(section?.querySelector('table')).not.toBeNull()
  })

  it('detecta filas con estado vacío o desactivado', () => {
    const doc = parseHtml(`
      <div class="eqcol">
        <h4>Busted</h4>
        <table>
          <thead><tr><th>Nombre</th><th>Estado</th></tr></thead>
          <tbody>
            <tr><td>MVOfetas</td><td></td></tr>
            <tr><td>Dresler</td><td>desactivado</td></tr>
            <tr><td>Rundull</td><td>baneado</td></tr>
          </tbody>
        </table>
      </div>
    `)

    expect(parseNonBannedBustedRows(doc)).toEqual([
      { label: 'MVOfetas', status: '(sin estado)' },
      { label: 'Dresler', status: 'desactivado' }
    ])
  })

  it('extrae userId y username de la página de clones', () => {
    const doc = parseHtml(`<h1>Clones de Agni</h1>`)
    expect(parseClonesPageMeta(doc, 'https://www.mediavida.com/usuarios/clones.php?id=376097')).toEqual({
      userId: '376097',
      username: 'Agni'
    })
  })
})
