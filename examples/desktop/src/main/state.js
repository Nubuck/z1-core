import z from '@z1/lib-state-box-node'

// main
const appState = z.fn((t, a) =>
  z.create('app', [
    {
      initial: {
        error: null,
        agent: null,
        auth: null,
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
            const [agentErr, agent] = await a.of(ctx.machine({ role: 'agent' }))
            if (agentErr) {
              console.log('AGENT ERR', agentErr)
              dispatch(mutators.bootComplete({ agent: null, error: agentErr }))
            } else {
              const [authErr, authResult] = await a.of(
                ctx.api.authenticate({
                  strategy: 'machine',
                  hashId: agent.user.hashId,
                })
              )
              dispatch(
                mutators.bootComplete({
                  agent,
                  error: authErr,
                  auth: authResult,
                })
              )
              done()
            }
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
