import { app } from 'electron'
import path from 'path'
import fs from 'fs'
import z from '@z1/lib-state-box-node'
import screenshot from 'screenshot-desktop'
import { accountState } from '@z1/kit-machine-account-node'
import { log } from './logger'

// types
const authStatus = {
  init: 'init',
  waiting: 'auth-waiting',
  loading: 'auth-loading',
  success: 'auth-success',
  fail: 'auth-fail',
}

// main
const appState = z.fn((t, a) =>
  z.create('app', [
    accountState('app', {
      apiAt: 'api',
      machineAt: 'machine',
      role: 'agent',
    }),
    {
      initial: {
        displays: [],
        transmit: {
          status: 'init',
          data: {},
          error: null,
        },
      },
      mutations(m) {
        return [
          m('displayChange', (state, action) => {
            return t.merge(state, {
              displays: t.atOr(state.displays, 'payload.displays', action),
            })
          }),
          m(['transmit', 'transmitComplete'], (state, action) => {
            return t.merge(state, {
              transmit: t.merge(state.transmit, action.payload),
            })
          }),
        ]
      },
      effects(fx, box) {
        return [
          fx(
            [box.actions.authenticateComplete],
            async (ctx, dispatch, done) => {
              const account = t.at('app', ctx.getState())
              if (t.not(authStatus.success, account.status)) {
                done()
              } else {
                const [displayErr, displayResult] = await a.of(
                  screenshot.listDisplays()
                )
                if (displayErr) {
                  log.error('List displays err', displayResult)
                } else {
                  dispatch(
                    box.mutators.displayChange({
                      displays: displayResult,
                    })
                  )
                }
                const mainScreen = t.head(displayResult)
                const [screenErr, screenResult] = await a.of(
                  screenshot({
                    screen: mainScreen.id,
                    filename: path.join(
                      app.getPath('home'),
                      '.z1',
                      `screen_${account.user._id}_${t.to.snakeCase(
                        `${mainScreen.id}`
                      )}.png`
                    ),
                  })
                )
                if (screenErr) {
                  log.error('Screenshot main err', screenErr)
                  dispatch(
                    box.mutators.transmit({
                      status: 'failed',
                      data: { path: null },
                      error: screenErr,
                    })
                  )
                } else {
                  dispatch(
                    box.mutators.transmit({
                      status: 'waiting',
                      data: { path: screenResult },
                      error: null,
                    })
                  )
                }
                done()
              }
            }
          ),
          fx(box.actions.transmit, async (ctx, dispatch, done) => {
            const transmit = t.atOr({}, 'app.transmit', ctx.getState())
            const screenPath = t.at('data.path', transmit)
            if (t.isNil(screenPath)) {
              done()
            } else {
              // check upload
              const [uploadErr, uploadResult] = await a.of(
                ctx.api.upload({
                  uri: {
                    stream: fs.createReadStream(screenPath),
                    name: path.basename(screenPath),
                  },
                })
              )
              if (uploadErr) {
                log.error('Screenshot upload err', uploadErr)
                dispatch(
                  box.mutators.transmitComplete({
                    status: 'failed',
                    error: uploadErr,
                  })
                )
              } else {
                dispatch(
                  box.mutators.transmitComplete({
                    status: 'ready',
                    data: { path: screenPath, result: uploadResult },
                    error: null,
                  })
                )
              }
              // const [downloadErr, downloadResult] = await a.of(
              //   ctx.api.download(
              //     'https://rawcdn.githack.com/SaucecodeOfficial/zero-one-core/3f742a6743988ca9c1a3019b0e1c08aa222725c3/logo.png',
              //     path.join(app.getPath('home'), '.z1'),
              //     {
              //       fileName: 'z1.png',
              //     }
              //   )
              // )
              // if (downloadErr) {
              //   log.error('Download err', downloadErr)
              // } else {
              //   log.debug('Download result', downloadResult)
              // }
              done()
            }
          }),
        ]
      },
    },
  ])
)

export const state = [appState]
