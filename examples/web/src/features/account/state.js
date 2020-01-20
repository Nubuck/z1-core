import z from '@z1/lib-feature-box'

// main
export const state = z.fn((t, a) =>
  z.state.create('account', [
    {
      initial: {
        connected: false,
        status: null,
        user: null,
        error: null,
      },
      mutations(m) {
        return [
          m('authenticate', (state, action) => {
            return state
          }),
          m('authenticateComplete', (state, action) => {
            return state
          }),
        ]
      },
      // routes(r) {
      //   return []
      // },
      guards(g, { actions, mutators }) {
        return [
          g(
            [t.globrex('*/ROUTING/*').regex],
            async ({ getState, action, redirect }, allow, reject) => {
              allow(action)
            }
          ),
        ]
      },
      effects(fx, { actions, mutators }) {
        return [
          fx([actions.authenticate], async (ctx, dispatch, done) => {
            done()
          }),
        ]
      },
      onInit({ api }) {
        api.io.on('connect', () => {
          console.log('API CONNECT')
        })
        api.io.on('disconnect', () => {
          console.log('API DISCONNECT')
        })
      },
    },
  ])
)
