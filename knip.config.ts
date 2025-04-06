import type { KnipConfig } from 'knip'

export default {
  entry: [
    'src/entries/contentScript/global/*.{ts,tsx}',
    'src/entries/contentScript/sections/*.{ts,tsx}',
    'src/entries/popup/*.{ts,tsx}',
    'src/entries/background/*.{ts,tsx}'
  ],
  project: ['src/**/*.{ts,tsx}'],
  ignore: ['src/entries/enableDevHmr.ts'],
  ignoreDependencies: [
    // Used to get types for src/manifest.ts
    '@types/chrome'
  ]
} satisfies KnipConfig
