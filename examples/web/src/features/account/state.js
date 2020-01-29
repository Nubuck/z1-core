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
            g([t.globrex('*/ROUTING/*').regex], async (ctx, allow, reject) => {
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
                  const authenticated = t.and(
                    t.notNil(t.at('account.user', state)),
                    t.eq(authStatus.success, t.at('account.authStatus', state))
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
                          redirectBackTo: t.neq(
                            box.actions.routeView,
                            ctx.action.type
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
                            redirectBackTo: t.neq(
                              box.actions.routeView,
                              ctx.action.type
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
            g(box.actions.routeView, async (ctx, allow, reject) => {
              const state = ctx.getState()
              if (
                t.and(
                  t.isNil(t.at('account.user', state)),
                  t.neq(authStatus.success, t.at('account.authStatus', state))
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
                const account = t.at('account', ctx.getState())
                if (
                  t.or(
                    t.not(account.connected),
                    t.and(
                      t.eq(account.authStatus, authStatus.success),
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
                  t.eq(t.at('account.authStatus', state), authStatus.success)
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
              done()
            }),
            // fx(box.actions.routeView, (ctx, dispatch, done) => {
            //   const redirectBackTo = t.at('payload.redirectBackTo', ctx.action)
            //   if (t.isNil(redirectBackTo)) {
            //     done()
            //   } else {
            //     dispatch(box.mutators.redirectChange(redirectBackTo))
            //     done()
            //   }
            // }),
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
  )
export default stateKit
