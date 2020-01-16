import z from '@z1/lib-state-box-node'

// main
const appState = z.fn((t, a) =>
  z.create('app', [
    {
      initial: {
        error: null,
        agent: null,
      },
      mutations(m) {
        return [
          m(['boot', 'bootComplete'], (state, action) => {
            return t.merge(state, action.payload)
          }),
        ]
      },
      effects(fx, { actions, mutators }) {
        return [
          fx([actions.boot], async (ctx, dispatch, done) => {
            // const [agentErr, agent] = await a.of(ctx.machine({ role: 'agent' }))
            // const payload = t.isNil(agentErr)
            //   ? { agent, error: null }
            //   : { agent: null, error: agentErr }
            const [authErr, authResult] = await a.of(
              ctx.api.authenticate({
                strategy: 'machine',
                machine: {},
                user: {},
              })
            )
            console.log('AUTH RESULT', authErr, authResult)
            dispatch(mutators.bootComplete({}))
            done()
          }),
        ]
      },
      onInit({ dispatch, mutators }) {
        dispatch(mutators.boot({}))
      },
    },
  ])
)

export const state = [appState]
