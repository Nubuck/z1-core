import React from 'react'
import mx from '@z1/lib-feature-macros'

// main
export const notAuthorized = mx.view.create('not-authorized', {
  ui(ctx) {
    return () => {
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
                label="Back Home"
                icon="home"
                to="/"
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
