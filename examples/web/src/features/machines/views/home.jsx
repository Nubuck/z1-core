import React from 'react'
import mx from '@z1/lib-feature-macros'
import sc from '@z1/lib-ui-schema'

// main
export const home = mx.fn((t, a) =>
  mx.routeView.create('home', {
    state() {
      const { types } = mx.routeView
      return {
        initial: {
          data: {
            machines: {},
          },
          form: {},
        },
        data(props) {
          console.log('Machines VIEW DATA', props)
          return {
            status: props.status,
            data: props.data,
            error: t.atOr(null, 'error', props.next || {}),
          }
        },
      }
    },
    ui(ctx) {
      return props => {
        return (
          <ctx.Page
            key="machines"
            centered
            render={() => (
              <React.Fragment>
                <ctx.IconLabel
                  icon={{ name: 'laptop', size: '6xl', color: 'blue-500' }}
                  label={{
                    fontWeight: 'bold',
                    text: 'Machines',
                    fontSize: '4xl',
                  }}
                  info={{
                    text: 'under construction',
                    fontSize: 'xl',
                    margin: { y: 4 },
                  }}
                  margin={{ bottom: 4 }}
                  flexDirection="col"
                  slots={{
                    icon: { x: 'center', margin: { bottom: 3 } },
                    label: { x: 'center' },
                  }}
                />
              </React.Fragment>
            )}
          />
        )
      }
    },
  })
)
