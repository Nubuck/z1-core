import { app } from 'electron'
import path from 'path'
import fs from 'fs'
import z from '@z1/lib-state-box-node'
import screenshot from 'screenshot-desktop'
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
    {
      initial: {
        connected: false,
        status: authStatus.init,
        error: null,
        account: null,
        displays: [],
        transmit: {
          status: 'init',
          data: {},
          error: null,
        },
      },
      mutations(m) {
        return [
          m(['boot'], (state, action) => {
            return t.merge(state, action.payload)
          }),
          m(['connection'], (state, action) => {
            return t.merge(state, { connected: action.payload || false })
          }),
          m('authenticate', state => {
            return t.merge(state, {
              status: authStatus.waiting,
              error: null,
            })
          }),
          m('authenticateComplete', (state, action) => {
            return t.merge(state, action.payload)
          }),
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
            [box.actions.boot, box.actions.connection],
            (ctx, dispatch, done) => {
              const account = t.at('app', ctx.getState())
              if (
                t.or(
                  t.not(account.connected),
                  t.and(
                    t.eq(account.status, authStatus.success),
                    t.eq(account.connected, true)
                  )
                )
              ) {
                log.debug(
                  t.not(account.connected) ? 'disconnected' : 'skip auth'
                )
                done()
              } else {
                log.debug('auth')
                dispatch(box.mutators.authenticate())
                done()
              }
            }
          ),
          fx([box.actions.authenticate], async (ctx, dispatch, done) => {
            try {
              if (t.not(t.atOr(false, 'app.connected', ctx.getState()))) {
                log.debug('auth not connected')
                dispatch(
                  box.mutators.authenticateComplete({
                    status: authStatus.fail,
                    account: null,
                    error: new Error('Not connected'),
                  })
                )
                done()
              } else {
                log.debug('re-auth begin')
                const [reAuthErr, reAuthResult] = await a.of(
                  ctx.api.authentication.reAuthenticate()
                )
                if (reAuthErr) {
                  log.debug(
                    're-auth failed -> create local machine account begin'
                  )
                  const [accountErr, account] = await a.of(
                    ctx.machine.account({ role: 'agent' })
                  )
                  if (accountErr) {
                    log.debug('create local machine account failed')
                    dispatch(
                      box.mutators.authenticateComplete({
                        status: authStatus.fail,
                        account: null,
                        error: accountErr,
                      })
                    )
                    done()
                  } else {
                    log.debug(
                      'create local machine account -> auth begin',
                      account
                    )
                    const [authErr, authResult] = await a.of(
                      ctx.api.authenticate({
                        strategy: 'machine',
                        hashId: t.at('login.hashId', account),
                      })
                    )
                    if (authErr) {
                      log.debug(
                        'auth failed -> create remote machine account with sysInfo begin'
                      )
                      const [sysErr, machineWithSys] = await a.of(
                        ctx.machine.system(account.machine)
                      )
                      const nextAccount = t.and(
                        t.isNil(sysErr),
                        t.notNil(machineWithSys)
                      )
                        ? {
                            machine: machineWithSys,
                            login: account.login,
                          }
                        : account
                      if (sysErr) {
                        log.debug(
                          'collecting system information failed',
                          sysErr
                        )
                      }
                      const [remoteErr, remote] = await a.of(
                        ctx.api.service('machine-account').create(nextAccount)
                      )
                      if (remoteErr) {
                        log.debug('create remote machine account failed')
                        dispatch(
                          box.mutators.authenticateComplete({
                            status: authStatus.fail,
                            account: null,
                            error: remoteErr,
                          })
                        )
                        done()
                      } else {
                        log.debug(
                          'create remote machine account success -> next auth begin',
                          remote
                        )
                        const [nextAuthErr, nextAuthResult] = await a.of(
                          ctx.api.authenticate({
                            strategy: 'machine',
                            hashId: t.at('login.hashId', remote),
                          })
                        )
                        if (nextAuthErr) {
                          log.debug('next auth failed')
                          dispatch(
                            box.mutators.authenticateComplete({
                              status: authStatus.fail,
                              account: null,
                              error: nextAuthErr,
                            })
                          )
                          done()
                        } else {
                          log.debug('next auth success', nextAuthResult)
                          dispatch(
                            box.mutators.authenticateComplete({
                              status: authStatus.success,
                              account: t.at('user', nextAuthResult),
                              error: null,
                            })
                          )
                          done()
                        }
                      }
                    } else {
                      log.debug('auth success', authResult)
                      dispatch(
                        box.mutators.authenticateComplete({
                          status: authStatus.success,
                          account: t.at('user', authResult),
                          error: null,
                        })
                      )
                      done()
                    }
                  }
                } else {
                  log.debug('re-auth success')
                  dispatch(
                    box.mutators.authenticateComplete({
                      status: authStatus.success,
                      account: t.at('user', reAuthResult),
                      error: null,
                    })
                  )
                  done()
                }
              }
            } catch (e) {
              log.debug('AUTH ERR', e)
              done()
            }
          }),
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
                      `${account.account._id}_screen_${t.to.snakeCase(
                        mainScreen.id
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
              // check download
              const [downloadErr, downloadResult] = await a.of(
                ctx.api.download(
                  'https://rawcdn.githack.com/SaucecodeOfficial/zero-one-core/3f742a6743988ca9c1a3019b0e1c08aa222725c3/logo.png',
                  path.join(app.getPath('home'), '.z1'),
                  {
                    fileName: 'z1.png',
                  }
                )
              )
              if (downloadErr) {
                log.error('Download err', downloadErr)
              } else {
                log.debug('Download result', downloadResult)
              }
              done()
            }
          }),
        ]
      },
      onInit(ctx) {
        ctx.dispatch(ctx.mutators.boot())
        ctx.api.io.on('connect', () => {
          ctx.dispatch(ctx.mutators.connection(true))
        })
        ctx.api.io.on('disconnect', () => {
          ctx.dispatch(ctx.mutators.connection(false))
        })
      },
    },
  ])
)

export const state = [appState]
