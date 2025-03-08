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
      js: ['src/entries/contentScript/primary/main.ts'],
      css: ['src/entries/contentScript/primary/premium-styles.css'],
      matches: allowedUrls,
      all_frames: true,
      run_at: 'document_start'
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
  permissions: ['storage'],
  web_accessible_resources: [
    {
      resources: ['images/*'],
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
