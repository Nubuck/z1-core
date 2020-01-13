import zbx from '@z1/lib-feature-box'
import mx from '@z1/lib-feature-macros'

// parts
import views from './views'

// main
const name = 'landing'
export const state = zbx.fn(t =>
  zbx.state.create(name, [
    {
      routes(r) {
        return [r('/', 'routeLanding', state => state)]
      },
    },
    mx.routeView.configure(name, {
      path: 'pages',
      state: views.state(),
      routes: {
        home: {},
        view: {},
        detail: {},
        more: {},
      },
    }),
  ])
)
