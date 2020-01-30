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
  z.fn((t, a) => {
    const skipViewsExcept401 = (actions, actionType, state) =>
      t.or(
        t.neq(actions.routeView, actionType),
        t.and(
          t.eq(actions.routeView, actionType),
          t.eq(t.at('location.payload.view', state), 'not-authorized')
        )
      )
    const authenticated = state =>
      t.and(
        t.notNil(t.at('account.user', state)),
        t.eq(authStatus.success, t.at('account.authStatus', state))
      )
    return z.state.create(name, [
      {
        initial: {
          connected: false,
          authStatus: authStatus.init,
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
                authStatus: authStatus.waiting,
                error: null,
              })
            }),
            m('authenticateComplete', (state, action) => {
              return t.merge(state, action.payload)
            }),
            m('logout', state => {
              return t.merge(state, {
                authStatus: authStatus.fail,
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
            g([t.globrex('*/ROUTING/*').regex], (ctx, allow, reject) => {
              const state = ctx.getState()
              const routesMap = t.at('location.routesMap', state)
              const routeMeta = t.at('meta.location.current', ctx.action)
              // skip if location invalid
              if (t.or(t.isNil(routesMap), t.isNil(routeMeta))) {
                allow(ctx.action)
              } else {
                const route = t.at(ctx.action.type, routesMap)
                // skip if route invalid
                if (t.isNil(route)) {
                  allow(ctx.action)
                } else if (
                  t.and(t.not(route.authenticate), t.isNil(route.allowRoles))
                ) {
                  // skip if route is public
                  allow(ctx.action)
                } else {
                  // skip if route only requires authentication + account is valid
                  if (t.and(t.isNil(route.allowRoles), authenticated(state))) {
                    allow(ctx.action)
                  } else if (t.not(authenticated(state))) {
                    // reject invalid account -> redirect to login
                    reject(
                      ctx.redirect(
                        box.mutators.routeView({
                          view: 'sign-in',
                          redirectBackTo: skipViewsExcept401(
                            box.actions,
                            ctx.action.type,
                            state
                          )
                            ? t.omit(['meta'], ctx.action)
                            : null,
                        })
                      )
                    )
                  } else {
                    const allowRoles = t.isType(route.allowRoles, 'array')
                      ? route.allowRoles
                      : [route.allowRoles]
                    // skip if user in routes declared roles
                    if (
                      t.includes(t.at('account.user.role', state), allowRoles)
                    ) {
                      allow(ctx.action)
                    } else {
                      // reject invalid role -> redirect 401
                      reject(
                        ctx.redirect(
                          box.mutators.routeView({
                            view: 'not-authorized',
                            redirectBackTo: skipViewsExcept401(
                              box.actions,
                              ctx.action.type,
                              state
                            )
                              ? t.omit(['meta'], ctx.action)
                              : null,
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
            g(box.actions.routeView, (ctx, allow, reject) => {
              const state = ctx.getState()
              if (
                t.or(
                  t.not(authenticated(state)),
                  t.eq(t.at('location.payload.view', state), 'not-authorized')
                )
              ) {
                allow(ctx.action)
              } else {
                reject(
                  ctx.redirect(
                    z.routing.parts.pathToAction(
                      '/',
                      t.at('location.routesMap', state)
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
                const state = ctx.getState()
                const connected = t.at('account.connected', state)
                if (
                  t.or(
                    t.not(connected),
                    t.and(authenticated(state), t.eq(connected, true))
                  )
                ) {
                  done()
                } else {
                  dispatch(box.mutators.authenticate())
                  done()
                }
              }
            ),
            fx(box.actions.authenticate, async (ctx, dispatch, done) => {
              try {
                const [authError, authResult] = await a.of(
                  ctx.api.authentication.reAuthenticate()
                )
                if (authError) {
                  dispatch(
                    box.mutators.authenticateComplete({
                      authStatus: authStatus.fail,
                      user: null,
                      error: authError,
                    })
                  )
                  done()
                } else {
                  dispatch(
                    box.mutators.authenticateComplete({
                      authStatus: authStatus.success,
                      user: authResult,
                      error: null,
                    })
                  )
                  done()
                }
              } catch (e) {
                done()
              }
            }),
            fx(box.actions.authenticateComplete, (ctx, dispatch, done) => {
              const state = ctx.getState()
              const redirectBackTo = t.at('account.redirectBackTo', state)
              if (t.isNil(redirectBackTo)) {
                if (
                  t.allOf([
                    authenticated(state),
                    t.not(
                      skipViewsExcept401(
                        box.actions,
                        t.at('location.type', state),
                        state
                      )
                    ),
                  ])
                ) {
                  dispatch(
                    ctx.redirect(
                      z.routing.parts.pathToAction(
                        '/',
                        t.at('location.routesMap', state)
                      )
                    )
                  )
                }
                done()
              } else {
                dispatch(box.mutators.redirectChange(null))
                dispatch(ctx.redirect(redirectBackTo))
                done()
              }
            }),
            fx(box.actions.logout, (ctx, dispatch, done) => {
              ctx.api.logout()
              dispatch(
                ctx.redirect(
                  z.routing.parts.pathToAction(
                    '/',
                    t.at('location.routesMap', ctx.getState())
                  )
                )
              )
              done()
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
      mx.view.configure(name, {
        path: 'account',
        state: views.state({}),
      }),
      parts.state.registerNav({
        anon: sc.nav.create(n => [
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
        ]),
        secure: sc.nav.create(n => [
          n('/#sign-out', {
            slot: 'primary-action',
            icon: 'sign-out-alt',
            label: 'Sign-out',
            action: {
              type: 'account/LOGOUT',
              payload: null,
            },
          }),
        ]),
      }),
    ])
  })
export default stateKit
