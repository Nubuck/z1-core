import z from '@z1/lib-state-box-node'

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
        agent: null,
        auth: null,
        services: [],
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
                done()
              } else {
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
                console.log('auth not connected')
                dispatch(
                  box.mutators.authenticateComplete({
                    status: authStatus.fail,
                    agent: null,
                    error: new Error('Not connected'),
                  })
                )
              } else {
                const [reAuthErr, reAuthResult] = await a.of(
                  ctx.api.authentication.reAuthenticate()
                )
                if (reAuthErr) {
                  console.log('reauth failed')
                  const [agentErr, agent] = await a.of(
                    ctx.machine.account({ role: 'agent' })
                  )
                  if (agentErr) {
                    console.log('agent failed')
                    dispatch(
                      box.mutators.authenticateComplete({
                        status: authStatus.fail,
                        agent: null,
                        error: agentErr,
                      })
                    )
                    done()
                  } else {
                    const [authErr, authResult] = await a.of(
                      ctx.api.authenticate({
                        strategy: 'machine',
                        hashId: agent.user.hashId,
                      })
                    )
                    if (authErr) {
                      console.log('auth failed')
                      const [systemErr, systemResult] = await a.of(
                        ctx.machine.system(agent.machine)
                      )
                      const [accountErr, account] = await a.of(
                        ctx.api
                          .service('machine-account')
                          .create(
                            t.isNil(systemErr)
                              ? { machine: systemResult, user: agent.user }
                              : agent
                          )
                      )
                      if (accountErr) {
                        console.log('account failed')
                        dispatch(
                          box.mutators.authenticateComplete({
                            status: authStatus.fail,
                            agent: null,
                            error: accountErr,
                          })
                        )
                        done()
                      } else {
                        const [nextAuthErr, nextAuthResult] = await a.of(
                          ctx.api.authenticate({
                            strategy: 'machine',
                            hashId: account.user.hashId,
                          })
                        )
                        if (nextAuthErr) {
                          console.log('next auth failed')
                          dispatch(
                            box.mutators.authenticateComplete({
                              status: authStatus.fail,
                              agent: null,
                              error: nextAuthErr,
                            })
                          )
                          done()
                        } else {
                          dispatch(
                            box.mutators.authenticateComplete({
                              status: authStatus.success,
                              agent: t.pick(
                                ['machine', 'user'],
                                nextAuthResult
                              ),
                              error: null,
                            })
                          )
                          done()
                        }
                      }
                    } else {
                      dispatch(
                        box.mutators.authenticateComplete({
                          status: authStatus.success,
                          agent: t.pick(['machine', 'user'], authResult),
                          error: null,
                        })
                      )
                    }
                  }
                } else {
                  dispatch(
                    box.mutators.authenticateComplete({
                      status: authStatus.success,
                      agent: t.pick(['machine', 'user'], reAuthResult),
                      error: null,
                    })
                  )
                }
              }
            } catch (e) {
              console.log('AUTH ERR', e)
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
