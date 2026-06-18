/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'

import {
  findBustedSection,
  parseAllCloneIdentities,
  parseAllCloneLabels,
  parseClonesPageMeta,
  parseNonBannedBustedRows,
  parseNonBannedCloneRows,
  parseNonBannedIpCloneRows
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

  it('ignora cuentas desactivadas en tabla Busted', () => {
    const doc = parseHtml(`
      <div class="eqcol">
        <h4>Busted</h4>
        <table>
          <thead><tr><th>Nombre</th><th>Estado</th></tr></thead>
          <tbody>
            <tr><td>Schade</td><td>baneado</td></tr>
            <tr><td>Kidene</td><td>desactivado</td></tr>
            <tr><td>KingBarou</td><td><strong>b</strong></td></tr>
          </tbody>
        </table>
      </div>
    `)

    expect(parseNonBannedBustedRows(doc)).toEqual([])
  })

  it('detecta filas con estado vacío pero no desactivadas', () => {
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

    expect(parseNonBannedBustedRows(doc)).toEqual([{ label: 'MVOfetas', status: '(sin estado)' }])
  })

  it('ignora cuentas desactivadas en listas ul/li', () => {
    const doc = parseHtml(`
      <div class="eqcol">
        <h4>Busted</h4>
        <ul>
          <li><a href="#">CuentaA</a> <strong>d</strong></li>
          <li><a href="#">CuentaB</a> <strong>p</strong></li>
        </ul>
      </div>
    `)

    expect(parseNonBannedBustedRows(doc)).toEqual([{ label: 'CuentaB', status: 'sanción activa' }])
  })

  it('ignora estados compuestos como baneado punish', () => {
    const doc = parseHtml(`
      <div class="eqcol">
        <h4>Busted</h4>
        <table>
          <thead><tr><th>Nombre</th><th>Estado</th></tr></thead>
          <tbody>
            <tr><td>dulci</td><td>baneado punish</td></tr>
            <tr><td>getorix</td><td>Baneado</td></tr>
            <tr><td>yonosoynadie</td><td>desactivado</td></tr>
          </tbody>
        </table>
      </div>
    `)

    expect(parseNonBannedBustedRows(doc)).toEqual([])
  })

  it('combina tabla y lista ul/li en la misma sección Busted', () => {
    const doc = parseHtml(`
      <div class="eqcol">
        <h4>Busted</h4>
        <table>
          <thead><tr><th>Nombre</th><th>Estado</th></tr></thead>
          <tbody>
            <tr><td>dulci</td><td>baneado</td></tr>
          </tbody>
        </table>
        <ul>
          <li><a href="#">Yun</a></li>
        </ul>
      </div>
    `)

    expect(parseNonBannedBustedRows(doc)).toEqual([{ label: 'Yun', status: '(sin estado)' }])
  })

  it('detecta clones activos en IPs con clones aunque Busted esté resuelto', () => {
    const doc = parseHtml(`
      <div class="eqcol">
        <h4>Busted</h4>
        <table>
          <thead><tr><th>Nombre</th><th>Estado</th></tr></thead>
          <tbody>
            <tr><td>dulci</td><td>baneado punish</td></tr>
            <tr><td>getorix</td><td>baneado</td></tr>
          </tbody>
        </table>
      </div>
      <div class="eqcol">
        <h4>IPs con clones</h4>
        <h5>79.116.102.xxx</h5>
        <table>
          <thead><tr><th>Nombre</th><th>Fecha</th><th>Estado</th></tr></thead>
          <tbody>
            <tr><td>Yun</td><td>30 May 26</td><td></td></tr>
          </tbody>
        </table>
        <h5>79.116.158.xxx</h5>
        <table>
          <thead><tr><th>Nombre</th><th>Fecha</th><th>Estado</th></tr></thead>
          <tbody>
            <tr><td>Spiker</td><td>8 Jun 26</td><td></td></tr>
          </tbody>
        </table>
        <table>
          <thead><tr><th>Nombre</th><th>Fecha</th><th>Estado</th></tr></thead>
          <tbody>
            <tr><td>Geere17</td><td>8 Jun 26</td><td></td></tr>
            <tr><td>Tattoo</td><td>25 May 26</td><td>baneado</td></tr>
          </tbody>
        </table>
      </div>
    `)

    expect(parseNonBannedIpCloneRows(doc)).toEqual([
      { label: 'Yun', status: '(sin estado)' },
      { label: 'Spiker', status: '(sin estado)' },
      { label: 'Geere17', status: '(sin estado)' }
    ])
    expect(parseNonBannedCloneRows(doc)).toEqual([])
  })

  it('extrae userId y username de la página de clones', () => {
    const doc = parseHtml(`<h1>Clones de Agni</h1>`)
    expect(parseClonesPageMeta(doc, 'https://www.mediavida.com/usuarios/clones.php?id=376097')).toEqual({
      userId: '376097',
      username: 'Agni'
    })
  })

  it('usa la columna Perfil y el enlace al perfil en tablas', () => {
    const doc = parseHtml(`
      <div class="eqcol">
        <h4>IPs con clones</h4>
        <table>
          <thead><tr><th>Perfil</th><th>Fecha</th><th>Estado</th></tr></thead>
          <tbody>
            <tr>
              <td><a href="/perfil.php?id=123456">CloneNick</a></td>
              <td>8 Jun 26</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    `)

    expect(parseNonBannedIpCloneRows(doc)).toEqual([
      {
        label: 'CloneNick',
        status: '(sin estado)',
        profileUrl: 'https://www.mediavida.com/perfil.php?id=123456'
      }
    ])
  })

  it('ignora columnas numéricas y toma el nick del enlace de perfil', () => {
    const doc = parseHtml(`
      <div class="eqcol">
        <h4>Busted</h4>
        <table>
          <thead><tr><th>#</th><th>Perfil</th><th>Estado</th></tr></thead>
          <tbody>
            <tr>
              <td>0</td>
              <td><a href="https://www.mediavida.com/perfil.php?id=999001">RealClone</a></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    `)

    expect(parseNonBannedBustedRows(doc)).toEqual([
      {
        label: 'RealClone',
        status: '(sin estado)',
        profileUrl: 'https://www.mediavida.com/perfil.php?id=999001'
      }
    ])
  })

  it('empareja nick en texto plano con clones.php?id= en otra celda de la fila', () => {
    const doc = parseHtml(`
      <div class="eqcol">
        <h4>Busted</h4>
        <table>
          <thead><tr><th>Nombre</th><th>Clones</th><th>Estado</th></tr></thead>
          <tbody>
            <tr>
              <td>Lunara</td>
              <td><a href="https://www.mediavida.com/usuarios/clones.php?id=368645" title="Ver clones"><img alt=""></a></td>
              <td>baneado</td>
            </tr>
          </tbody>
        </table>
      </div>
    `)

    expect(parseAllCloneIdentities(doc)).toEqual([
      {
        userId: '368645',
        username: 'Lunara',
        profileUrl: 'https://www.mediavida.com/perfil.php?id=368645'
      }
    ])
  })

  it('empareja nick en lista ul/li con clones.php?id= e ignora marcador baneado', () => {
    const doc = parseHtml(`
      <div class="eqcol">
        <h4>Busted</h4>
        <ul>
          <li>
            Lunara
            <a href="https://www.mediavida.com/usuarios/clones.php?id=368645" title="Ver clones"><img alt=""></a>
            <strong>b</strong>
          </li>
        </ul>
      </div>
    `)

    expect(parseAllCloneIdentities(doc)).toEqual([
      {
        userId: '368645',
        username: 'Lunara',
        profileUrl: 'https://www.mediavida.com/perfil.php?id=368645'
      }
    ])
    expect(parseAllCloneLabels(doc)).toEqual(['Lunara'])
  })

  it('detecta busteds no baneados en listas ul/li', () => {
    const doc = parseHtml(`
      <div class="eqcol">
        <h4>Busted</h4>
        <ul>
          <li>
            Novelist
            <a href="/usuarios/clones.php?id=222"><img alt=""></a>
          </li>
        </ul>
      </div>
    `)

    expect(parseNonBannedBustedRows(doc)).toEqual([
      {
        label: 'Novelist',
        status: '(sin estado)',
        profileUrl: 'https://www.mediavida.com/perfil.php?id=222'
      }
    ])
  })

  it('detecta Novelist sin banear en tabla real de Lunara (texto plano)', () => {
    const doc = parseHtml(`
      <div class="eqcol">
        <h4>Busted</h4>
        <table>
          <thead><tr><th>Nombre</th><th>Fecha</th><th>Aggro</th><th>Punish</th><th>Estado</th></tr></thead>
          <tbody>
            <tr><td>Novelist</td><td>12 May 26</td><td>0</td><td>0</td><td></td></tr>
            <tr><td>Leh</td><td>15 Apr 26</td><td>2</td><td>1</td><td>baneado</td></tr>
          </tbody>
        </table>
      </div>
    `)

    expect(parseNonBannedBustedRows(doc)).toEqual([
      {
        label: 'Novelist',
        status: '(sin estado)'
      }
    ])
  })

  it('incluye enlace de perfil en listas ul/li', () => {
    const doc = parseHtml(`
      <div class="eqcol">
        <h4>Busted</h4>
        <ul>
          <li><a href="/perfil.php?id=42">CuentaB</a> <strong>p</strong></li>
        </ul>
      </div>
    `)

    expect(parseNonBannedBustedRows(doc)).toEqual([
      {
        label: 'CuentaB',
        status: 'sanción activa',
        profileUrl: 'https://www.mediavida.com/perfil.php?id=42'
      }
    ])
  })

  it('detecta busteds en cascada usando enlaces de clones.php', () => {
    const doc = parseHtml(`
      <div class="eqcol">
        <h4>Busted</h4>
        <table>
          <thead><tr><th>Perfil</th><th>Estado</th></tr></thead>
          <tbody>
            <tr><td><a href="/usuarios/clones.php?id=111">Lunara</a></td><td>baneado</td></tr>
          </tbody>
        </table>
      </div>
    `)

    expect(parseAllCloneIdentities(doc)).toEqual([
      {
        userId: '111',
        username: 'Lunara',
        profileUrl: 'https://www.mediavida.com/perfil.php?id=111'
      }
    ])
  })

  it('lista nicks en texto plano de Busted para cascada', () => {
    const doc = parseHtml(`
      <div class="eqcol">
        <h4>Busted</h4>
        <table>
          <thead><tr><th>Nombre</th><th>Estado</th></tr></thead>
          <tbody>
            <tr><td>Lunara</td><td>baneado</td></tr>
            <tr><td>Novelist</td><td></td></tr>
          </tbody>
        </table>
      </div>
    `)

    expect(parseAllCloneLabels(doc)).toEqual(['Lunara', 'Novelist'])
    expect(parseAllCloneIdentities(doc)).toEqual([])
  })

  it('la cascada ignora los nicks de «IPs con clones» (solo sigue Busted)', () => {
    const doc = parseHtml(`
      <div class="eqcol">
        <h4>Busted</h4>
        <table>
          <thead><tr><th>Nombre</th><th>Estado</th></tr></thead>
          <tbody>
            <tr><td><a href="/id/Lunara">Lunara</a></td><td>baneado</td></tr>
          </tbody>
        </table>
      </div>
      <div class="eqcol">
        <h4>IPs con clones</h4>
        <table>
          <thead><tr><th>Nombre</th><th>Estado</th></tr></thead>
          <tbody>
            <tr><td><a href="/id/Tattoo">Tattoo</a></td><td></td></tr>
          </tbody>
        </table>
      </div>
    `)

    expect(parseAllCloneLabels(doc)).toEqual(['Lunara'])
  })
})
