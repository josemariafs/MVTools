/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'

const clonePages: Record<string, string> = {}

const nickToUserId: Record<string, string> = {
  lunara: '368645',
  novelist: '222',
  jastro: '4242'
}

const normalizeNick = (value: string): string =>
  decodeURIComponent(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()

const createFetchMock = () =>
  vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url

    if (url.includes('joincheck.php')) {
      const body = init?.body?.toString() ?? ''
      const match = body.match(/q=([^&]*)/)
      const nick = normalizeNick(match?.[1] ?? '')
      const exists = Boolean(nickToUserId[nick])
      return new Response(JSON.stringify(exists ? 1 : 0), { status: 200, statusText: 'OK' })
    }

    const profileMatch = url.match(/\/id\/([^/?#]+)/i)
    if (profileMatch) {
      const nick = normalizeNick(profileMatch[1])
      const userId = nickToUserId[nick]
      if (!userId) {
        return new Response('', { status: 404, statusText: 'Not Found' })
      }
      return new Response(`<a href="/usuarios/clones.php?id=${userId}">buscar clones</a>`, {
        status: 200,
        statusText: 'OK'
      })
    }

    const userId = new URL(url, 'https://www.mediavida.com').searchParams.get('id')
    const html = userId ? clonePages[userId] : undefined

    if (!html) {
      return new Response('', { status: 404, statusText: 'Not Found' })
    }

    return new Response(html, { status: 200, statusText: 'OK' })
  })

vi.mock('@/services/config', () => ({
  getGlobalConfig: vi.fn(),
  setGlobalConfig: vi.fn()
}))

vi.stubGlobal('fetch', createFetchMock())

import { checkTrackedCloneAccount, resolveUserIdFromProfilePage } from '@/services/clone-tracking'

describe('clone-tracking cascade', () => {
  beforeEach(() => {
    for (const key of Object.keys(clonePages)) {
      delete clonePages[key]
    }
    vi.mocked(fetch).mockImplementation(createFetchMock())
  })

  it('detecta busteds no baneados en clones de clones (Leh → Lunara → Novelist)', async () => {
    clonePages['100'] = `
      <h1>Clones de Leh</h1>
      <div class="eqcol">
        <h4>Busted</h4>
        <table>
          <thead><tr><th>Perfil</th><th>Estado</th></tr></thead>
          <tbody>
            <tr><td><a href="/usuarios/clones.php?id=368645">Lunara</a></td><td>baneado</td></tr>
          </tbody>
        </table>
      </div>
    `

    clonePages['368645'] = `
      <h1>Clones de Lunara</h1>
      <div class="eqcol">
        <h4>Busted</h4>
        <table>
          <thead><tr><th>Perfil</th><th>Fecha</th><th>Aggro</th><th>Punish</th><th>Estado</th></tr></thead>
          <tbody>
            <tr>
              <td><a href="/usuarios/clones.php?id=222">Novelist</a></td>
              <td>12 May 26</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    `

    const result = await checkTrackedCloneAccount({ userId: '100', username: 'Leh' })

    expect(result).toEqual({
      userId: '100',
      username: 'Leh',
      clonesUrl: 'https://www.mediavida.com/usuarios/clones.php?id=100',
      nonBannedRows: [
        {
          label: 'Novelist',
          status: '(sin estado)',
          profileUrl: 'https://www.mediavida.com/perfil.php?id=222',
          viaUsername: 'Lunara',
          viaClonesUrl: 'https://www.mediavida.com/usuarios/clones.php?id=368645'
        }
      ]
    })
  })

  it('cascada con nicks en texto plano sin enlace (Leh → Lunara → Novelist)', async () => {
    clonePages['100'] = `
      <h1>Clones de Leh</h1>
      <div class="eqcol">
        <h4>Busted</h4>
        <table>
          <thead><tr><th>Nombre</th><th>Fecha</th><th>Aggro</th><th>Punish</th><th>Estado</th></tr></thead>
          <tbody>
            <tr><td>Lunara</td><td>8 May 26</td><td></td><td></td><td>baneado</td></tr>
          </tbody>
        </table>
      </div>
    `

    clonePages['368645'] = `
      <h1>Clones de Lunara</h1>
      <div class="eqcol">
        <h4>Busted</h4>
        <table>
          <thead><tr><th>Nombre</th><th>Fecha</th><th>Aggro</th><th>Punish</th><th>Estado</th></tr></thead>
          <tbody>
            <tr><td>Novelist</td><td>12 May 26</td><td></td><td></td><td></td></tr>
          </tbody>
        </table>
      </div>
    `

    const result = await checkTrackedCloneAccount({ userId: '100', username: 'Leh' })

    expect(result?.nonBannedRows).toEqual([
      {
        label: 'Novelist',
        status: '(sin estado)',
        profileUrl: 'https://www.mediavida.com/perfil.php?id=222',
        viaUsername: 'Lunara',
        viaClonesUrl: 'https://www.mediavida.com/usuarios/clones.php?id=368645'
      }
    ])
  })

  it('no alerta si la cadena entera está resuelta', async () => {
    clonePages['100'] = `
      <h1>Clones de Leh</h1>
      <div class="eqcol">
        <h4>Busted</h4>
        <table>
          <thead><tr><th>Perfil</th><th>Estado</th></tr></thead>
          <tbody>
            <tr><td><a href="/perfil.php?id=368645">Lunara</a></td><td>baneado</td></tr>
          </tbody>
        </table>
      </div>
    `

    clonePages['368645'] = `
      <h1>Clones de Lunara</h1>
      <div class="eqcol">
        <h4>Busted</h4>
        <table>
          <thead><tr><th>Perfil</th><th>Estado</th></tr></thead>
          <tbody>
            <tr><td><a href="/perfil.php?id=222">Novelist</a></td><td>baneado</td></tr>
          </tbody>
        </table>
      </div>
    `

    const result = await checkTrackedCloneAccount({ userId: '100', username: 'Leh' })
    expect(result).toBeNull()
  })

  it('cascada con icono clones.php en otra celda (joincheck devuelve 1, no el ID real)', async () => {
    clonePages['100'] = `
      <h1>Clones de Leh</h1>
      <div class="eqcol">
        <h4>Busted</h4>
        <table>
          <thead><tr><th>Nombre</th><th>Fecha</th><th>Clones</th><th>Estado</th></tr></thead>
          <tbody>
            <tr>
              <td>Lunara</td>
              <td>8 May 26</td>
              <td><a href="https://www.mediavida.com/usuarios/clones.php?id=368645" title="Ver clones"><img alt=""></a></td>
              <td>baneado</td>
            </tr>
          </tbody>
        </table>
      </div>
    `

    clonePages['368645'] = `
      <h1>Clones de Lunara</h1>
      <div class="eqcol">
        <h4>Busted</h4>
        <table>
          <thead><tr><th>Nombre</th><th>Estado</th></tr></thead>
          <tbody>
            <tr><td><a href="/usuarios/clones.php?id=222">Novelist</a></td><td></td></tr>
          </tbody>
        </table>
      </div>
    `

    const result = await checkTrackedCloneAccount({ userId: '100', username: 'Leh' })

    expect(result?.nonBannedRows).toEqual([
      {
        label: 'Novelist',
        status: '(sin estado)',
        profileUrl: 'https://www.mediavida.com/perfil.php?id=222',
        viaUsername: 'Lunara',
        viaClonesUrl: 'https://www.mediavida.com/usuarios/clones.php?id=368645'
      }
    ])
  })

  it('cascada Leh → Lunara → Novelist en listas ul/li (formato real mediavida)', async () => {
    clonePages['100'] = `
      <h1>Clones de Leh</h1>
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
    `

    clonePages['368645'] = `
      <h1>Clones de Lunara</h1>
      <div class="eqcol">
        <h4>Busted</h4>
        <ul>
          <li>
            Novelist
            <a href="/usuarios/clones.php?id=222"><img alt=""></a>
          </li>
        </ul>
      </div>
    `

    const result = await checkTrackedCloneAccount({ userId: '100', username: 'Leh' })

    expect(result?.nonBannedRows).toEqual([
      {
        label: 'Novelist',
        status: '(sin estado)',
        profileUrl: 'https://www.mediavida.com/perfil.php?id=222',
        viaUsername: 'Lunara',
        viaClonesUrl: 'https://www.mediavida.com/usuarios/clones.php?id=368645'
      }
    ])
  })

  it('resuelve profileUrl por nickname cuando la tabla no tiene enlace', async () => {
    clonePages['300'] = `
      <h1>Clones de PinkBoy</h1>
      <div class="eqcol">
        <h4>Busted</h4>
        <table>
          <thead><tr><th>Nombre</th><th>Estado</th></tr></thead>
          <tbody>
            <tr><td>Jastro</td><td></td></tr>
          </tbody>
        </table>
      </div>
    `

    const result = await checkTrackedCloneAccount({ userId: '300', username: 'PinkBoy' })

    expect(result?.nonBannedRows).toEqual([
      {
        label: 'Jastro',
        status: '(sin estado)',
        profileUrl: 'https://www.mediavida.com/perfil.php?id=4242'
      }
    ])
  })

  it('resuelve nick → id desde /id/{nick} (perfil público)', async () => {
    await expect(resolveUserIdFromProfilePage('Lunara')).resolves.toBe('368645')
  })
})
