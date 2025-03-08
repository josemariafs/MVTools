import { STORAGE_KEYS, type StorageKey } from '@/constants'

export const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean'
export const isStorageKey = (key: string): key is StorageKey => Object.values(STORAGE_KEYS).includes(key)
