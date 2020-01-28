import z from '@z1/lib-feature-box'

// main
export const state = z.fn(t =>
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
                  t.eq(t.atOr(null, 'account.authStatus', state), 'auth-success'),
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
