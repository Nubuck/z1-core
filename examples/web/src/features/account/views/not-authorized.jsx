import React from 'react'
import mx from '@z1/lib-feature-macros'

// main
export const notAuthorized = mx.fn((t, a) =>
  mx.view.create('not-authorized', {
    ui(ctx) {
      return props => {
        return (
          <ctx.Page
            key="not-authorized"
            centered
            render={() => (
              <React.Fragment>
                <ctx.IconLabel
                  icon={{ name: 'ban', size: '6xl', color: 'blue-500' }}
                  label={{ text: '401', fontWeight: 'bold', fontSize: '4xl' }}
                  info={{
                    text: 'Not Authorized',
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
                <ctx.Button
                  as={ctx.Link}
                  to="/"
                  label="Back Home"
                  icon="home"
                  shape="pill"
                  fill="outline"
                  colors={{ on: 'blue-500', off: 'yellow-500' }}
                />
              </React.Fragment>
            )}
          />
        )
      }
    },
  })
)
