import zbx from '@z1/lib-feature-box'
import mx from '@z1/lib-feature-macros'

// parts
import views from './views'

// main
const name = 'landing'
export const state = zbx.fn(t =>
  zbx.state.create(name, [
    mx.routeView.configure(name, {
      state: views.state(),
      routes: {
        home: {},
        view: {},
        detail: {},
        more: {},
      },
    }),
    // {
    //   intial: {},
    //   // mutations(m) {
    //   //   return []
    //   // },
    //   routes(r) {
    //     return [r('/', 'routeHome', state => state)]
    //   },
    //   // guards(g, { actions, mutators }) {
    //   //   return []
    //   // },
    //   // effects(fx, { actions, mutators }) {
    //   //   return []
    //   // },
    // },
  ])
)
