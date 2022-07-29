import z from '@z1/lib-feature-box'

// parts
import { authStatus, authenticated, skipViewsExcept401 } from '../fn'

// main
export const effects = z.fn((t, a) => (boxName, props) => (fx, box) => {
  const apiAt = t.atOr('api', 'apiAt', props)
  return [
    fx(
      [box.actions.boot, box.actions.connection],
      async (ctx, dispatch, done) => {
        try {
          const state = ctx.getState()
          const connected = t.path([boxName, 'connected'], state)
          if (
            t.or(
              t.not(connected),
              t.and(authenticated(boxName, state), t.eq(connected, true))
            )
          ) {
            const [_, statusResult] = await a.of(
              ctx.api.service('account-status').get('')
            )
            dispatch(box.mutators.info(statusResult))
            done()
          } else {
            dispatch(box.mutators.authenticate())
            done()
          }
          done()
        } catch (e) {
          console.error(e)
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
        const [_, statusResult] = await a.of(
          ctx.api.service('account-status').get('')
        )
        dispatch(box.mutators.info(statusResult))
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
      const accountStatus = t.path([boxName, 'info'], state)
      const authSuccess = authenticated(boxName, state)
      if (t.allOf([t.eq('init', accountStatus), t.not(authSuccess)])) {
        if (
          t.anyOf([
            t.neq(box.actions.routeView, t.at('location.type', state)),
            t.neq('sign-up', t.at('location.payload.view', state)),
          ])
        ) {
          dispatch(ctx.redirect(box.mutators.routeView({ view: 'sign-up' })))
        }
        done()
      } else if (t.allOf([t.eq('invite', accountStatus), t.not(authSuccess)])) {
        if (
          t.anyOf([
            t.neq(box.actions.routeView, t.at('location.type', state)),
            t.neq('sign-in', t.at('location.payload.view', state)),
          ])
        ) {
          dispatch(ctx.redirect(box.mutators.routeView({ view: 'sign-in' })))
        }
        done()
      } else if (t.isNil(redirectBackTo)) {
        if (
          t.allOf([
            authSuccess,
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
    fx(box.actions.logout, async (ctx, dispatch, done) => {
      dispatch({
        type: 'body/BOOT_CHANGE',
        payload: 'waiting',
      })
      const api = t.at(apiAt, ctx)
      await a.of(api.logout())
      const [_, statusResult] = await a.of(
        ctx.api.service('account-status').get('')
      )
      dispatch(box.mutators.info(statusResult))
      const state = ctx.getState()
      if (t.eq('invite', statusResult)) {
        if (
          t.anyOf([
            t.neq(box.actions.routeView, t.at('location.type', state)),
            t.neq('sign-in', t.at('location.payload.view', state)),
          ])
        ) {
          dispatch(ctx.redirect(box.mutators.routeView({ view: 'sign-in' })))
        }
      } else {
        dispatch(
          ctx.redirect(
            z.routing.parts.pathToAction('/', t.at('location.routesMap', state))
          )
        )
      }
      dispatch({
        type: 'body/BOOT_CHANGE',
        payload: 'ready',
      })
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
})
