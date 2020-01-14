import { app } from 'electron'
import robot from 'robot-js'

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

// app events
app.on('ready', () => {
  console.log('APP READY')
  if (robot.Window.isAxEnabled()) {
    const active = robot.Window.getActive()
    console.log('ACTIVE WINDOW', active.getTitle())
  }
})
