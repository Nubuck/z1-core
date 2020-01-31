import z from '@z1/lib-feature-box'
import mx from '@z1/lib-feature-macros'
import sc from '@z1/lib-ui-schema'

// parts
import views from './views'

// main
const name = 'cloudStorage'
const routeProps = { authenticate: true }
export const stateKit = parts =>
  z.state.create(name, [
    mx.view.configure(name, {
      path: 'cloud-storage',
      state: views.state({}),
      routes: {
        home: routeProps,
        view: routeProps,
        detail: routeProps,
        more: routeProps,
      },
    }),
    parts.registerNav({
      secure: sc.nav.create(n => [
        n('/cloud-storage', {
          slot: 'nav',
          label: 'Cloud Storage',
          icon: 'cloud-upload-alt',
        }),
      ]),
    }),
  ])

export default stateKit
