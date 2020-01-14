import z from '@z1/lib-feature-box'

// main
export const state = z.fn((t, a) =>
  z.state.create('account', [
    {
      intial: {},
      mutations(m) {
        return []
      },
      routes(r) {
        return []
      },
      guards(g, { actions, mutators }) {
        return []
      },
      effects(fx, { actions, mutators }) {
        return []
      },
    },
  ])
) 
