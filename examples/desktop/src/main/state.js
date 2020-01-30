import z from '@z1/lib-state-box-node'
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
        ]
      },
      effects(fx, box) {
        return [
          fx(
            [box.actions.boot, box.actions.connection],
            (ctx, dispatch, done) => {
              const account = t.path(['app'], ctx.getState())
              if (
                t.or(
                  t.not(account.connected),
                  t.and(
                    t.eq(account.status, authStatus.success),
                    t.eq(account.connected, true)
                  )
                )
              ) {
                log.debug('skip auth')
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
              if (
                t.not(t.pathOr(false, ['app', 'connected'], ctx.getState()))
              ) {
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
                        'auth failed -> create remote machine account begin'
                      )
                      const [remoteErr, remote] = await a.of(
                        ctx.api.service('machine-account').create(account)
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
