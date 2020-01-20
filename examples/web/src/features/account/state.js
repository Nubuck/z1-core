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
          m('connection', (state, action) => {
            return t.merge(state, { connected: action.payload })
          }),
          m('authenticate', (state, action) => {
            return state
          }),
          m('authenticateComplete', (state, action) => {
            return state
          }),
        ]
      },
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
      onInit({ api, dispatch, mutators }) {
        api.io.on('connect', () => {
          dispatch(mutators.connection(true))
        })
        api.io.on('disconnect', () => {
          dispatch(mutators.connection(false))
        })
      },
    },
  ])
)
