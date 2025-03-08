import browser from 'webextension-polyfill'

browser.runtime.onInstalled.addListener(() => {
  console.debug('Extension has been installed')
})
