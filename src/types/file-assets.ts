interface ScriptFileObject {
  path: string
  extension: string
}

export const SCRIPT_FILES = {
  MIGRATE_FROM_LOCAL_STORAGE: {
    path: 'src/entries/contentScript/injected/migrate-from-local-storage',
    extension: 'ts'
  }
} as const satisfies Record<string, ScriptFileObject>

export type ScriptFile = (typeof SCRIPT_FILES)[keyof typeof SCRIPT_FILES]
export const scriptFilePaths = Object.values(SCRIPT_FILES).map(({ path, extension }) => `${path}.${extension}`)
