import browser from 'webextension-polyfill'

export const getStoredProperty = async <T>(key: string, defaultValue: T) => {
  const { [key]: storedProperty } = await browser.storage.sync.get({ [key]: defaultValue })
  return storedProperty as T
}

export const setStoredProperty = async <T>(key: string, value: T) => {
  await browser.storage.sync.set({ [key]: value })
}

export const getLocalStoredProperty = async <T>(key: string, defaultValue: T) => {
  const { [key]: storedProperty } = await browser.storage.local.get({ [key]: defaultValue })
  return storedProperty as T
}

export const setLocalStoredProperty = async <T>(key: string, value: T) => {
  await browser.storage.local.set({ [key]: value })
}

export const removeLocalStoredKey = (key: string) => {
  return browser.storage.local.remove(key)
}
