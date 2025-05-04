import webExtension from '@samrum/vite-plugin-web-extension'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import zipPack from 'vite-plugin-zip-pack'

import pkg from './package.json'
import { getManifest } from './src/manifest'
import { scriptFilePaths } from './src/types/content-script-assets'

export type Browser = 'chrome' | 'firefox' | undefined

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const browser = (env.BROWSER ?? 'chrome') as Browser
  const shouldZip = env.ZIP === 'true'
  const extensionVersion = pkg.version
  console.debug(`Building version ${extensionVersion} for ${browser} browser`)

  return {
    base: '',
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler'
        }
      }
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    },
    server: {
      cors: {
        methods: 'GET',
        origin: '*'
      }
    },
    plugins: [
      react(),
      webExtension({
        manifest: getManifest(browser),
        useDynamicUrlWebAccessibleResources: false,
        additionalInputs: {
          scripts: scriptFilePaths
        }
      }),
      shouldZip &&
        zipPack({
          outDir: 'releases',
          outFileName: `${browser}-release-${extensionVersion}.zip`
        })
    ]
  }
})
