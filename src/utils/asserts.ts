export const objectEntries = <T extends string | number, U>(obj: Record<T, U>): Array<[T, U]> => Object.entries(obj) as Array<[T, U]>
export const isHTMLElement = <T extends HTMLElement>(element: unknown): element is T => element instanceof HTMLElement
