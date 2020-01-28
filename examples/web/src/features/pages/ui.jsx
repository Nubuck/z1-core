import React from 'react'

// main
export const landingRoute = ui => () => (
  <ui.Page
    key="landing"
    centered
    render={() => (
      <React.Fragment>
        <ui.IconLabel
          icon={{ name: 'superpowers', size: '6xl', color: 'green-500' }}
          label={{ fontWeight: 'bold', text: 'Example App', fontSize: '4xl' }}
          margin={{ bottom: 4 }}
        />
        <ui.Button
          as={ui.Link}
          to="/account/sign-up"
          size="lg"
          shape="pill"
          fill="outline"
          label="Get Started"
          color="green-500"
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
