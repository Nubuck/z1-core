const Proto = require('uberproto')

export const Logger = logger => {
  return app => {
    if (typeof logger === 'function') {
      app.use(logger)
    } else if (typeof logger !== 'undefined') {
      app.set('logger', logger)
    }

    Proto.mixin(
      {
        _logger: logger,

        log(...args) {
          if (this._logger && typeof this._logger.log === 'function') {
            return this._logger.log.apply(this._logger, args)
          }

          return console.log('LOG: ', ...args)
        },

        info(...args) {
          if (this._logger && typeof this._logger.info === 'function') {
            return this._logger.info.apply(this._logger, args)
          }

          return console.info('INFO: ', ...args)
        },

        warn(...args) {
          if (this._logger && typeof this._logger.warn === 'function') {
            return this._logger.warn.apply(this._logger, args)
          }

          return console.warn('WARNING: ', ...args)
        },

        error(...args) {
          if (this._logger && typeof this._logger.error === 'function') {
            return this._logger.error.apply(this._logger, args)
          }
          return console.error('ERROR: ', ...args)
        },

        debug(...args) {
          if (this._logger && typeof this._logger.debug === 'function') {
            return this._logger.debug.apply(this._logger, ['debug', ...args])
          }

          return console.error('DEBUG: ', ...args)
        },
      },
      app
    )
  }
}
