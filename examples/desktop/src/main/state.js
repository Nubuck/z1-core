import z from '@z1/lib-state-box-node'

// main
const appState = z.fn((t, a) =>
  z.create('app', [
    {
      initial: {
        status: 'anon',
        error: null,
        agent: null,
        auth: null,
      },
      mutations(m) {
        return [
          m(['boot', 'bootComplete'], (state, action) => {
            return t.merge(state, action.payload)
          }),
          m(['authComplete'], (state, action) => {
            return t.merge(state, action.payload)
          }),
        ]
      },
      effects(fx, { actions, mutators }) {
        return [
          fx([actions.boot], async (ctx, dispatch, done) => {
            const [agentErr, agent] = await a.of(ctx.machine({ role: 'agent' }))
            if (agentErr) {
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
          fx([actions.bootComplete], async (ctx, dispatch, done) => {
            const state = ctx.getState()
            const accessToken = t.pathOr(
              null,
              ['app', 'auth', 'accessToken'],
              state
            )
            if (t.not(t.isNil(accessToken))) {
              dispatch(mutators.authComplete({ status: 'authenticated' }))
              done()
            } else {
              const agent = t.pathOr({}, ['app', 'agent'], state)
              const [accountErr, account] = await a.of(
                ctx.api.service('machine-account').create(agent)
              )
              if (accountErr) {
                dispatch(
                  mutators.authComplete({
                    error: accountErr,
                  })
                )
              }
              const [authErr, authResult] = await a.of(
                ctx.api.authenticate({
                  strategy: 'machine',
                  hashId: account.user.hashId,
                })
              )
              dispatch(
                mutators.authComplete({
                  agent: account,
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