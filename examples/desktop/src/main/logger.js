import z from '@z1/lib-state-box-node'
import logger from 'electron-log'

// exports
export const createLogger = z.fn(t => () => {
  logger.transports.file.maxSize = 1024 * 1024
  logger.transports.console.level = 'debug'
  logger.transports.file.level = 'debug'
  const level = {
    status: 'not-set',
    set() {
      if (
        t.and(
          t.eq(level.status, 'not-set'),
          t.isType(process.getLogLevel, 'Function')
        )
      ) {
        logger.transports.console.level = process.getLogLevel()
        logger.transports.file.level = process.getLogLevel()
        level.status = 'set'
      }
    },
  }
  return {
    info(...args) {
      level.set()
      logger.info(...args)
    },
    debug(...args) {
      level.set()
      logger.debug(...args)
    },
    warn(...args) {
      level.set()
      logger.warn(...args)
    },
    error(...args) {
      level.set()
      logger.error(...args)
    },
  }
})

export const log = createLogger()
