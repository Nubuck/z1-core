import { app } from 'electron'
import os from 'os'
import robot from 'robot-js'
import screenshot from 'screenshot-desktop'
import sysInfo from 'systeminformation'

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
  console.log('OS HOST', os.hostname())
  if (robot.Window.isAxEnabled()) {
    const active = robot.Window.getActive()
    console.log('ACTIVE WINDOW ', active.getTitle())
    screenshot
      .listDisplays()
      .then(displays => console.log('DISPLAYS ', displays))
      .catch(err => console.log('DISPLAYS ERR ', err))
    sysInfo
      .system()
      .then(sys => {
        console.log('SYSTEM INFO HARDWARE UUID ', sys.uuid)
      })
      .catch(err => console.log('SYSTEM INFO ERR ', err))
  }
})
