const LOG_LEVELS = {
  DEBUG: 'debug',
  LOG: 'log',
  ERROR: 'error'
} as const

type LogLevel = (typeof LOG_LEVELS)[keyof typeof LOG_LEVELS]

export function devLog({ message, logLevel = LOG_LEVELS.LOG }: { message: string; logLevel?: LogLevel }): void {
  if (import.meta.env.MODE === 'production' && import.meta.env.VITE_TEST === 'false') return
  console[logLevel]('[MVTools]: ' + message)
}
