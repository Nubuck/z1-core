import React from 'react'
import mx from '@z1/lib-feature-macros'

// main
export const profile = mx.fn((t, a) =>
  mx.view.create('profile', {
    state(ctx) {
      return {
        initial: {
          data: {
            machine: null,
          },
        },
        data(props) {
          return {
            status: props.status,
            error: t.atOr(null, 'next.error', props),
            data: t.runMatch({
              _: () => props.data,
              [ctx.event.dataLoadComplete]: () =>
                t.merge(props.data, {
                  machine: t.atOr(
                    props.data.machine,
                    'next.data.machine',
                    props
                  ),
                }),
            })(props.event),
          }
        },
        async load(props) {
          const [machErr, machine] = await a.of(
            props.api.service('machines').get(props.params.detail)
          )
          if (machErr) {
            return {
              status: props.status,
              error: machErr,
              data: {
                machine: null,
              },
            }
          }
          return {
            status: props.status,
            error: null,
            data: {
              machine,
            },
          }
        },
      }
    },
    ui(ctx) {
      return () => {
        return (
          <ctx.Page
            key="machine-profile"
            render={() => (
              <React.Fragment>
                <ctx.IconLabel
                  icon={{ name: 'laptop', size: '3xl', color: 'blue-500' }}
                  label={{
                    text: 'Machine Profile',
                    fontWeight: 'bold',
                    fontSize: 'xl',
                  }}
                  margin={{ bottom: 4 }}
                />
              </React.Fragment>
            )}
          />
        )
      }
    },
  })
)
