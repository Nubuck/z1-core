import z from '@z1/lib-feature-box'
import mx from '@z1/lib-feature-macros'
import sc from '@z1/lib-ui-schema'

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
export const stateKit = parts =>
  z.fn((t, a) =>
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
        guards(g, box) {
          return [
            // protect routes
            g([t.globrex('*/ROUTING/*').regex], async (ctx, allow, reject) => {
              const state = ctx.getState()
              const routesMap = t.path(['location', 'routesMap'], state)
              const routeMeta = t.path(
                ['meta', 'location', 'current'],
                ctx.action
              )
              // skip if location invalid
              if (t.or(t.isNil(routesMap), t.isNil(routeMeta))) {
                allow(ctx.action)
              } else {
                const route = t.path([ctx.action.type], routesMap)
                // skip if route invalid
                if (t.isNil(route)) {
                  allow(ctx.action)
                } else if (
                  t.and(t.not(route.authenticate), t.isNil(route.allowRoles))
                ) {
                  // skip if route is public
                  allow(ctx.action)
                } else {
                  const authenticated = t.and(
                    t.notNil(t.path(['account', 'user'], state)),
                    t.eq(
                      authStatus.success,
                      t.path(['account', 'status'], state)
                    )
                  )
                  // skip if route only requires authentication + account is valid
                  if (t.and(t.isNil(route.allowRoles), authenticated)) {
                    allow(ctx.action)
                  } else if (t.not(authenticated)) {
                    // reject invalid account -> redirect to login
                    reject(
                      ctx.redirect(
                        box.mutators.routeView({
                          view: 'sign-in',
                          redirectBackTo: t.omit(['meta'], ctx.action),
                        })
                      )
                    )
                  } else {
                    const allowRoles = t.isType(route.allowRoles, 'array')
                      ? route.allowRoles
                      : [route.allowRoles]
                    // skip if user in routes declared roles
                    if (
                      t.includes(
                        t.path(['account', 'user', 'role'], state),
                        allowRoles
                      )
                    ) {
                      allow(ctx.action)
                    } else {
                      // reject invalid role -> redirect 401
                      reject(
                        ctx.redirect(
                          box.mutators.routeView({
                            view: 'not-authorized',
                            redirectBackTo: t.omit(['meta'], ctx.action),
                          })
                        )
                      )
                    }
                  }
                }
              }
              // end logic
            }),
            // prevent public account view access when authenticated
            g([box.actions.routeView], async (ctx, allow, reject) => {
              const state = ctx.getState()
              if (
                t.and(
                  t.isNil(t.path(['account', 'user'], state)),
                  t.neq(
                    authStatus.success,
                    t.path(['account', 'status'], state)
                  )
                )
              ) {
                allow(ctx.action)
              } else {
                reject(
                  ctx.redirect(
                    z.routing.parts.pathToAction(
                      '/',
                      t.path(['location', 'routesMap'], state)
                    )
                  )
                )
              }
            }),
          ]
        },
        effects(fx, box) {
          return [
            fx(
              [box.actions.boot, box.actions.connection],
              (ctx, dispatch, done) => {
                const account = t.path(['account'], ctx.getState())
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
                const [authError, authResult] = await a.of(
                  ctx.api.authentication.reAuthenticate()
                )
                if (authError) {
                  dispatch(
                    box.mutators.authenticateComplete({
                      status: authStatus.fail,
                      user: null,
                      error: authError,
                    })
                  )
                  done()
                } else {
                  dispatch(
                    box.mutators.authenticateComplete({
                      status: authStatus.success,
                      user: authResult,
                      error: null,
                    })
                  )
                  const redirectBackTo = t.path(
                    ['account', 'redirectBackTo'],
                    ctx.getState()
                  )
                  if (t.isNil(redirectBackTo)) {
                    const routesMap = t.path(['location', 'routesMap'], state)
                    dispatch(
                      ctx.redirect(z.routing.parts.pathToAction('/', routesMap))
                    )
                    done()
                  } else {
                    dispatch(box.mutators.redirectChange(null))
                    dispatch(ctx.redirect(redirectBackTo))
                    done()
                  }
                }
              } catch (e) {
                done()
              }
            }),
            fx([box.actions.routeView], (ctx, dispatch, done) => {
              const redirectBackTo = t.path(
                ['payload', 'redirectBackTo'],
                ctx.action
              )
              if (t.isNil(redirectBackTo)) {
                done()
              } else {
                dispatch(box.mutators.redirectChange(redirectBackTo))
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
      mx.routeView.configure(name, {
        path: 'account',
        state: views.state({}),
      }),
      parts.state.registerNav({ anon:sc.nav.create(n => [
        n('/account/sign-in', {
          slot: 'body-action',
          label: 'Sign-in',
          icon: 'sign-in-alt',
        }),
        n('/account/sign-up', {
          slot: 'body-action',
          label: 'Sign-up',
          icon: 'user-plus',
        }),
      ]) }),
    ])
  )
export default stateKit