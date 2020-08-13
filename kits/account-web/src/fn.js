import z from '@z1/lib-feature-box'

// parts
export const authStatus = {
  init: 'init',
  waiting: 'auth-waiting',
  loading: 'auth-loading',
  success: 'auth-success',
  fail: 'auth-fail',
}
export const authenticated = z.fn((t) => (boxName, state) =>
  t.and(
    t.notNil(t.path([boxName, 'user'], state)),
    t.eq(authStatus.success, t.path([boxName, 'authStatus'], state))
  )
)
export const skipViewsExcept401 = z.fn((t) => (actions, actionType, state) =>
  t.or(
    t.neq(actions.routeView, actionType),
    t.eq(t.at('location.payload.view', state), 'not-authorized')
  )
)