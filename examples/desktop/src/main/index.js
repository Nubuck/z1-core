import { app } from 'electron'
import os from 'os'
import sysInfo from 'systeminformation'
import z from '@z1/lib-state-box-node'
import api from '@z1/lib-api-box-client-node'

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

// state
const appState = z.fn((t, a) =>
  z.create('app', [
    {
      initial: {
        machine: null,
      },
      mutations(m) {
        return [
          m(['boot', 'bootComplete'], (state, action) => {
            return t.merge(state, action.payload)
          }),
        ]
      },
      effects(fx, { actions, mutators }) {
        return [
          fx([actions.boot], async (ctx, dispatch, done) => {
            const sys = await sysInfo.system()
            dispatch(
              mutators.bootComplete({
                machine: {
                  hostname: os.hostname(),
                  uuid: sys.uuid,
                },
              })
            )

            done()
          }),
        ]
      },
      onInit({ dispatch, mutators }) {
        dispatch(mutators.boot({}))
      },
    },
  ])
)

const boot = async () => {
  const client = await api('http://localhost:3035/api')
  const store = z.store.create({
    boxes: [appState],
    context: {
      api: client,
    },
    logging: process.env.NODE_ENV === 'development',
  })
  return null
}

// app events
app.on('ready', () => {
  console.log('App ready')
  boot()
    .then(() => console.log('App booted'))
    .catch(err => console.log('App boot err', err))
})
