import z from '@z1/lib-feature-box'

// main
export const stateKit = parts => z.fn(t =>
  z.state.create('pages', [
    {
      routes(r) {
        return [r('/', 'routeLanding', state => state)]
      },
      effects(fx, box) {
        return [
          fx(
            [box.actions.routeLanding, 'account/AUTHENTICATE_COMPLETE'],
            (context, dispatch, done) => {
              const state = context.getState()
              if (
                t.and(
                  parts.authenticated(state),
                  t.eq(t.at('location.type', state), box.actions.routeLanding)
                )
              ) {
                dispatch(
                  context.redirect({
                    type: 'machines/ROUTING/ROUTE_HOME',
                  })
                )
              }
              done()
            }
          ),
        ]
      },
    },
  ])
)
export default stateKit