import React from 'react'
import mx from '@z1/lib-feature-macros'
import sc from '@z1/lib-ui-schema'

// main
export const home = mx.fn((t, a) =>
  mx.view.create('home', {
    state() {
      const { types } = mx.view
      return {
        initial: {
          data: {
            machines: [],
          },
          form: {},
        },
        data(props) {
          console.log('Machines VIEW DATA', props)
          return {
            status: props.status,
            data: t.merge(props.data, {
              machines: t.atOr(
                props.data.machines,
                'next.data.machines',
                props
              ),
            }),
            error: t.atOr(null, 'next.error', props),
          }
        },
        async load(props) {
          const [machErr, machines] = await a.of(
            props.api.service('machines').find({
              query: {
                $limit: 10000,
              },
            })
          )
          if (machErr) {
            return {
              status: props.status,
              data: {
                machines: [],
              },
              error: machErr,
            }
          }
          return {
            status: props.status,
            data: {
              machines: machines.data,
            },
            error: null,
          }
        },
      }
    },
    ui(ctx) {
      return props => {
        return (
          <ctx.Page
            key="machines"
            render={() => (
              <React.Fragment>
                <ctx.IconLabel
                  icon={{ name: 'laptop', size: '3xl', color: 'blue-500' }}
                  label={{
                    fontWeight: 'bold',
                    text: 'Machines',
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
