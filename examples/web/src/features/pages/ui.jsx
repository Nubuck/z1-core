import React from 'react'

// main
export const landingRoute = ui => () => (
  <ui.Page
    key="landing"
    centered
    render={() => (
      <React.Fragment>
        <ui.IconLabel
          icon={{ name: 'superpowers', size: '6xl', color: 'blue-500' }}
          label={{ fontWeight: 'bold', text: 'Z1 System', fontSize: '4xl' }}
          info={{
            text: 'Macro driven development',
            fontSize: 'xl',
            margin: { y: 4 },
          }}
          margin={{ bottom: 4 }}
          flexDirection="col"
          cols={{
            left: { x: 'center', margin: { bottom: 3 } },
            right: { x: 'center' },
          }}
        />
        <ui.Button
          as={ui.Link}
          to="/account/sign-up"
          size="lg"
          shape="pill"
          fill="outline"
          label="Get Started"
          color="blue-500"
        />
      </React.Fragment>
    )}
  />
)

export const notFoundRoute = ctx => () => (
  <ctx.Page
    key="not-found"
    centered
    render={() => (
      <React.Fragment>
        <ctx.Row as="h1" fontSize="2xl" fontWeight="medium">
          404 Not Found
        </ctx.Row>
        <ctx.IconLabel
          as={ctx.Link}
          to="/"
          label="Home"
          icon="home"
          color={['blue-500', { hover: 'yellow-500' }]}
        />
      </React.Fragment>
    )}
  />
)
