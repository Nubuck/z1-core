import z from '@z1/lib-feature-box'

// parts
export const authStatus = {
  init: 'init',
  authWaiting: 'auth-waiting',
  authLoading: 'auth-loading',
  authSuccess: 'auth-success',
  authFail: 'auth-fail',
}

// main
export const state = z.fn((t, a) =>
  z.state.create('account', [
    {
      initial: {
        connected: false,
        status: authStatus.init,
        user: null,
        error: null,
        redirectBackTo: null,
        hash: null,
      },
      mutations(m) {
        return [
          m(['boot', 'connection'], (state, action) => {
            return t.merge(state, { connected: action.payload })
          }),
          m('authenticate', state => {
            return t.merge(state, {
              status: authStatus.authWaiting,
              error: null,
            })
          }),
          m('authenticateComplete', (state, action) => {
            return t.merge(state, action.payload)
          }),
        ]
      },
      guards(g, { actions, mutators }) {
        return [
          g(
            [t.globrex('*/ROUTING/*').regex],
            async ({ getState, action, redirect }, allow, reject) => {
              allow(action)
            }
          ),
        ]
      },
      effects(fx, { actions, mutators }) {
        return [
          fx(
            [actions.boot, actions.connection],
            ({ getState }, dispatch, done) => {
              const account = t.path(['account'], getState())
              if (
                t.or(
                  t.eq(account.connected, false),
                  t.and(
                    t.eq(account.status, authStatus.authSuccess),
                    t.eq(account.connected, true)
                  )
                )
              ) {
                done()
              } else {
                dispatch(mutators.authenticate())
                done()
              }
            }
          ),
          fx(
            [actions.authenticate],
            async ({ getState, api }, dispatch, done) => {
              dispatch(
                mutators.authenticateComplete({
                  status: authStatus.authFail,
                  user: null,
                  error: 'dev',
                })
              )
              done()
            }
          ),
        ]
      },
      onInit({ api, dispatch, mutators }) {
        dispatch(mutators.boot(false))
        api.io.on('connect', () => {
          dispatch(mutators.connection(true))
        })
        api.io.on('disconnect', () => {
          dispatch(mutators.connection(false))
        })
      },
    },
  ])
)
