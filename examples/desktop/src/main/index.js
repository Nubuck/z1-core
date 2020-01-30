import { app } from 'electron'
import { boot } from './boot'
import { log } from './logger'

process.on('unhandledRejection', (reason, p) => {
  log.error('Unhandled Rejection at: Promise ', p, reason)
})
process.on('uncaughtException', err => {
  log.error('Unhandled Exception: ', err)
})
process.on('exit', code => {
  log.debug(`About to exit with code: ${code}`)
})

// main
app.on('ready', () => {
  log.debug('App ready')
  boot()
    .then(() => log.debug('Boot run'))
    .catch(err => log.error('Boot err', err))
})
