const getArray = (dataList: unknown[]) => {
  return dataList.map(data => (typeof data === 'object' ? JSON.stringify(data, null, 2) : data))
}

const isDevMode = import.meta.env.MODE !== 'production'
const PREFIX = '[MV Tools] '

export const devLog = {
  log: (prefixMessage?: string, ...data: unknown[]) => {
    if (!isDevMode) return
    // eslint-disable-next-line no-restricted-syntax -- This is a custom log function
    console.log(PREFIX + prefixMessage, ...getArray(data))
  },
  error: (prefixMessage?: string, ...data: unknown[]) => {
    if (!isDevMode) return
    console.error(PREFIX + prefixMessage, ...getArray(data))
  }
}
