import { app } from 'electron'
import { boot } from './boot'

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at: Promise ', p, reason)
  app.quit()
  process.exit(0)
})
process.on('uncaughtException', err => {
  console.error('Unhandled Exception: ', err)
  app.quit()
  process.exit(0)
})
process.on('exit', code => {
  console.log(`About to exit with code: ${code}`)
})

// main
app.on('ready', () => {
  console.log('App ready')
  boot()
    .then(() => console.log('Boot run'))
    .catch(err => console.log('Boot err', err))
})
