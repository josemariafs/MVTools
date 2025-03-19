import { STORAGE_KEYS, type StorageKey } from '@/constants'

export const isStorageKey = (key: string): key is StorageKey => Object.values(STORAGE_KEYS).includes(key)
export const objectEntries = <T extends string | number, U>(obj: Record<T, U>): Array<[T, U]> => Object.entries(obj) as Array<[T, U]>
export const isHTMLElement = <T extends HTMLElement>(element: unknown): element is T => element instanceof HTMLElement
export const isUrlPath = (regExp: RegExp): boolean => regExp.test(location.pathname)
