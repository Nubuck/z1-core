import z from '@z1/lib-feature-box'
import mx from '@z1/lib-feature-macros'
import sc from '@z1/lib-ui-schema'
import {
  accountState,
  authenticated as isAuth,
  authStatus,
} from '@z1/kit-account-web'

// parts
import views from './views'

// main
const name = 'account'
export const authenticated = state => isAuth(name, state)
export const stateKit = parts =>
  z.state.create(name, [
    accountState(name, {
      apiAt: 'api',
    }),
    mx.view.configure(name, {
      path: name,
      state: views.state({ authStatus }),
    }),
    parts.registerNav({
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

export default stateKit
