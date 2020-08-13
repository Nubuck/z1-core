import z from '@z1/lib-feature-box'

// parts
import { authenticated, skipViewsExcept401 } from '../fn'

// main
export const guards = z.fn((t, a) => (boxName, props) => (g, box) => {
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
          if (t.and(t.isNil(route.allowRoles), authenticated(boxName, state))) {
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
              t.includes(t.path([boxName, 'user', 'role'], state), allowRoles)
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
            z.routing.parts.pathToAction('/', t.at('location.routesMap', state))
          )
        )
      }
    }),
  ]
})
