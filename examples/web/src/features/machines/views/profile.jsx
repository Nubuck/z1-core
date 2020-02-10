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
          return ctx.macro.data(props)
        },
        async load(props) {
          return await ctx.macro.load(
            [
              {
                entity: 'machine',
                method: props.api.service('machines').get(props.params.detail),
              },
            ],
            props
          )
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
