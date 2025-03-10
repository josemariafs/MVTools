import browser from 'webextension-polyfill'

export const getStoredProperty = async <T>(key: string, defaultValue: T) => {
  const { [key]: storedProperty } = await browser.storage.sync.get({ [key]: defaultValue })
  return storedProperty as T
}

export const setStoredProperty = async <T>(key: string, value: T) => {
  await browser.storage.sync.set({ [key]: value })
}
