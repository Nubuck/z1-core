import z from '@z1/lib-feature-box'

// parts
export const authStatus = {
  init: 'init',
  waiting: 'auth-waiting',
  loading: 'auth-loading',
  success: 'auth-success',
  fail: 'auth-fail',
}
export const authenticated = z.fn(t => (boxName, state) =>
  t.and(
    t.notNil(t.path([boxName, 'user'], state)),
    t.eq(authStatus.success, t.path([boxName, 'authStatus'], state))
  )
)
export const skipViewsExcept401 = z.fn(t => (actions, actionType, state) =>
  t.or(
    t.neq(actions.routeView, actionType),
    t.eq(t.at('location.payload.view', state), 'not-authorized')
  )
)

// main
export const authState = z.fn((t, a) => (boxName = 'account', props = {}) => {
  const apiAt = t.atOr('api', 'apiAt', props)
  return {
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
              if (
                t.and(t.isNil(route.allowRoles), authenticated(boxName, state))
              ) {
                allow(ctx.action)
              } else if (t.not(authenticated(boxName, state))) {
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
                  t.includes(
                    t.path([boxName, 'user', 'role'], state),
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
        }),
        // withViews
        // prevent public account view access when authenticated
        g(box.actions.routeView, (ctx, allow, reject) => {
          const state = ctx.getState()
          if (
            t.or(
              t.not(authenticated(boxName, state)),
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
            const connected = t.path([boxName, 'connected'], state)
            if (
              t.or(
                t.not(connected),
                t.and(authenticated(boxName, state), t.eq(connected, true))
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
            const api = t.at(apiAt, ctx)
            const [authError, authResult] = await a.of(
              api.authentication.reAuthenticate()
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
                  user: t.at('user', authResult),
                  error: null,
                })
              )
              done()
            }
          } catch (e) {
            dispatch(
              box.mutators.authenticateComplete({
                authStatus: authStatus.fail,
                user: null,
                error: e,
              })
            )
            done()
          }
        }),
        fx(box.actions.authenticateComplete, (ctx, dispatch, done) => {
          const state = ctx.getState()
          const redirectBackTo = t.path([boxName, 'redirectBackTo'], state)
          if (t.isNil(redirectBackTo)) {
            if (
              t.allOf([
                authenticated(boxName, state),
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
          const api = t.at(apiAt, ctx)
          api.logout()
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
        // with views
        fx([box.actions.routeView], (ctx, dispatch, done) => {
          const redirectBackTo = t.at('action.payload.redirectBackTo', ctx)
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
      const api = t.at(apiAt, ctx)
      api.io.on('connect', () => {
        ctx.dispatch(ctx.mutators.connection(true))
      })
      api.io.on('disconnect', () => {
        ctx.dispatch(ctx.mutators.connection(false))
      })
    },
  }
})
