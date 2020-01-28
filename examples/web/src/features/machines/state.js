import z from '@z1/lib-feature-box'
import mx from '@z1/lib-feature-macros'
// import sc from '@z1/lib-ui-schema'

// parts
import views from './views'

// main
const name = 'machines'
const routeProps = { authenticate: true }
export const stateKit = parts =>
  z.fn((t, a) =>
    z.state.create(name, [
      mx.routeView.configure(name, {
        path: 'machines',
        state: views.state({}),
        routes: {
          home: routeProps,
          view: routeProps,
          detail: routeProps,
          more: routeProps,
        },
      }),
      // parts.state.registerNav({
      //   secure: sc.nav.create(n => []),
      // }),
    ])
  )
export default stateKit
