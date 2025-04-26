import pkg from '../package.json'
import type { Browser } from '../vite.config'
import { FIREFOX_ADDON_ID } from './constants'

interface SharedManifest {
  content_scripts: chrome.runtime.ManifestBase['content_scripts']
  icons: chrome.runtime.ManifestIcons
  action: chrome.runtime.ManifestAction
  host_permissions: chrome.runtime.ManifestV3['host_permissions']
  web_accessible_resources?: chrome.runtime.ManifestV3['web_accessible_resources']
  permissions?: chrome.runtime.ManifestV3['permissions']
}

interface ManifestChrome extends SharedManifest {
  background?: chrome.runtime.ManifestV3['background']
}

interface ManifestFirefox extends Omit<ManifestChrome, 'background'> {
  background?: chrome.runtime.ManifestV2['background']
  browser_specific_settings?: chrome.runtime.ManifestV3['browser_specific_settings']
}

const allowedUrls = ['https://www.mediavida.com/*', 'https://www.chollometro.com/*']

const sharedManifest: SharedManifest = {
  content_scripts: [
    {
      js: ['src/entries/contentScript/global/main.ts'],
      css: ['src/entries/contentScript/global/premium-styles.css'],
      matches: ['https://www.mediavida.com/*'],
      exclude_matches: ['https://www.mediavida.com/embed/*'],
      all_frames: true
    },
    {
      js: ['src/entries/contentScript/sections/thread.tsx'],
      // Threads urls like /foro/feda/1234567
      matches: ['https://www.mediavida.com/foro/*/*'],
      exclude_matches: ['https://www.mediavida.com/foro/*/nuevo-hilo*'],
      all_frames: true
    },
    {
      js: ['src/entries/contentScript/sections/favorites-list.tsx'],
      matches: ['https://www.mediavida.com/foro/favoritos*'],
      all_frames: true
    },
    {
      js: ['src/entries/contentScript/sections/ignored-list.tsx'],
      matches: ['https://www.mediavida.com/foro/ignorados*'],
      all_frames: true
    },
    {
      js: ['src/entries/contentScript/sections/private-messages.tsx'],
      matches: ['https://www.mediavida.com/mensajes/*'],
      all_frames: true
    },
    {
      js: ['src/entries/contentScript/sections/reports.tsx'],
      matches: ['https://www.mediavida.com/foro/reportes.php*'],
      all_frames: true
    },
    {
      js: ['src/entries/contentScript/sections/clones.tsx'],
      matches: ['https://www.mediavida.com/usuarios/clones.php*'],
      all_frames: true
    },
    {
      js: ['src/entries/contentScript/sections/chollometro.tsx'],
      matches: ['https://www.chollometro.com/ofertas/*'],
      all_frames: true
    }
  ],
  icons: {
    16: 'icons/mvlogo.png',
    48: 'icons/mvlogo.png',
    128: 'icons/mvlogo.png'
  },
  action: {
    default_icon: 'icons/mvlogo.png',
    default_popup: 'src/entries/popup/index.html'
  },
  host_permissions: allowedUrls,
  permissions: ['storage', 'tabs', 'scripting'],
  web_accessible_resources: [
    {
      resources: ['images/*', 'icons/*'],
      matches: allowedUrls
    }
  ]
}

const backgroundScript = 'src/entries/background/service-worker.ts'

const manifestFirefox: ManifestFirefox = {
  ...sharedManifest,
  background: {
    scripts: [backgroundScript]
  },
  browser_specific_settings: {
    gecko: {
      id: FIREFOX_ADDON_ID
    }
  }
}

const manifestChrome: ManifestChrome = {
  ...sharedManifest,
  background: {
    service_worker: backgroundScript
  }
}

export function getManifest(browser: Browser): chrome.runtime.ManifestV3 {
  const manifest = {
    author: pkg.author,
    description: pkg.description,
    name: pkg.displayName,
    version: pkg.version,
    manifest_version: 3
  }

  if (!browser) throw new Error(`Missing manifest definition for browser`)

  if (browser === 'firefox') {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- we know the type
    return {
      ...manifest,
      ...manifestFirefox
    } as chrome.runtime.ManifestV3
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- we know the type
  return {
    ...manifest,
    ...manifestChrome
  } as chrome.runtime.ManifestV3
}
