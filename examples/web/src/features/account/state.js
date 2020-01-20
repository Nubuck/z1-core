import z from '@z1/lib-feature-box'
import mx from '@z1/lib-feature-macros'

// parts
import views from './views'

// types
const authStatus = {
  init: 'init',
  waiting: 'auth-waiting',
  loading: 'auth-loading',
  success: 'auth-success',
  fail: 'auth-fail',
}

// main
const name = 'account'
export const state = z.fn((t, a) =>
  z.state.create(name, [
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
            return t.merge(state, { connected: action.payload || false })
          }),
          m('redirectChange', (state, action) => {
            return t.merge(state, {
              redirectBackTo: action.payload,
            })
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
          m('logout', state => {
            return t.merge(state, {
              status: authStatus.fail,
              user: null,
              error: null,
              redirectBackTo: null,
            })
          }),
        ]
      },
      guards(g, { actions, mutators }) {
        return [
          // protect routes
          g(
            [t.globrex('*/ROUTING/*').regex],
            async ({ getState, action, redirect }, allow, reject) => {
              // location:
              const state = getState()
              const routesMap = t.path(['location', 'routesMap'], state)
              const routeMeta = t.path(['meta', 'location', 'current'], action)
              // skip if location invalid
              if (t.or(t.not(routesMap), t.not(routeMeta))) {
                allow(action)
              } else {
                // route:
                const route = t.path([action.type], routesMap)
                // skip if route invalid
                if (t.not(route)) {
                  allow(action)
                } else if (
                  t.and(t.not(route.authenticate), t.not(route.allowRoles))
                ) {
                  // skip if route is public
                  allow(action)
                } else {
                  // account:
                  const accountStatus = t.path(['account', 'status'], state)
                  const user = t.path(['account', 'user'], state)
                  const authenticated = t.and(
                    t.not(t.isNil(user)),
                    t.eq(authStatus.success, accountStatus)
                  )
                  // skip if route only requires authentication + account is valid
                  if (t.and(t.not(route.allowRoles), authenticated)) {
                    allow(action)
                  } else if (t.not(authenticated)) {
                    // reject invalid account -> redirect to login
                    reject(
                      redirect(
                        mutators.routeView({
                          view: 'sign-in',
                          redirectBackTo: t.omit(['meta'], action),
                        })
                      )
                    )
                  } else {
                    // roles:
                    const allowRoles = t.isType(route.allowRoles, 'array')
                      ? route.allowRoles
                      : [route.allowRoles]
                    const hasRole = t.gt(
                      t.findIndex(role => t.eq(role, user.role), allowRoles),
                      -1
                    )
                    // skip if user in routes declared roles
                    if (hasRole) {
                      allow(action)
                    } else {
                      // reject invalid role -> redirect 401
                      reject(
                        redirect(
                          mutators.routeView({
                            view: 'unauthorized',
                            redirectBackTo: t.omit(['meta'], action),
                          })
                        )
                      )
                    }
                  }
                }
              }
            }
          ),
          // prevent public account view access when authenticated
          g(
            [actions.routeView],
            async ({ getState, action, redirect }, allow, reject) => {
              const state = getState()
              const status = t.path(['account', 'status'], state)
              const user = t.path(['account', 'user'], state)
              if (
                t.and(t.not(t.isNil(user)), t.eq(authStatus.success, status))
              ) {
                const routesMap = t.path(['location', 'routesMap'], state)
                reject(redirect(z.routing.parts.pathToAction('/', routesMap)))
              } else {
                allow(action)
              }
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
                    t.eq(account.status, authStatus.success),
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
            async ({ getState, api, redirect }, dispatch, done) => {
              const [authError, authResult] = await a.of(
                api.authentication.reAuthenticate()
              )
              if (authError) {
                dispatch(
                  mutators.authenticateComplete({
                    status: authStatus.fail,
                    user: null,
                    error: authError,
                  })
                )
              } else {
                dispatch(
                  mutators.authenticateComplete({
                    status: authStatus.success,
                    user: authResult,
                    error: null,
                  })
                )
                const redirectBackTo = t.path(
                  ['account', 'redirectBackTo'],
                  getState()
                )
                if (t.not(t.isNil(redirectBackTo))) {
                  dispatch(mutators.redirectChange(null))
                  dispatch(redirect(redirectBackTo))
                } else {
                  const routesMap = t.path(['location', 'routesMap'], state)
                  dispatch(
                    redirect(z.routing.parts.pathToAction('/', routesMap))
                  )
                }
              }
              done()
            }
          ),
          fx([actions.routeView], ({ action }, dispatch, done) => {
            const redirectBackTo = t.path(['payload', 'redirectBackTo'], action)
            if (t.isNil(redirectBackTo)) {
              done()
            } else {
              dispatch(mutators.redirectChange(redirectBackTo))
              done()
            }
          }),
        ]
      },
      onInit({ api, dispatch, mutators }) {
        dispatch(mutators.boot())
        api.io.on('connect', () => {
          dispatch(mutators.connection(true))
        })
        api.io.on('disconnect', () => {
          dispatch(mutators.connection(false))
        })
      },
    },
    mx.routeView.configure(name, {
      path: 'account',
      state: views.state({}),
    }),
  ])
)
