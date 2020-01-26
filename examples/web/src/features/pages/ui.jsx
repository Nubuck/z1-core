import React from 'react'

// stubs
import { items } from './els'

// main
export const landingRoute = ctx => () => (
  <ctx.Page
    key="landing"
    render={() => (
      <React.Fragment>
        <ctx.Row as="h1" fontSize="2xl" fontWeight="medium">
          Home
        </ctx.Row>
        <ctx.IconLabel
          as={ctx.Link}
          to="/account/sign-in"
          label="Sign-in"
          icon="sign-in-alt"
          color={['blue-500', { hover: 'yellow-500' }]}
        />
        <ctx.IconLabel
          as={ctx.Link}
          to="/account/sign-up"
          label="Sign-up"
          icon="user-plus"
          color={['blue-500', { hover: 'yellow-500' }]}
        />
        <ctx.VList
          items={items}
          rowHeight={90}
          render={(account, rowProps) => {
            return (
              <ctx.ListItem
                key={rowProps.key}
                style={rowProps.style}
                {...account}
                content={() => (
                  <React.Fragment>
                    <ctx.IconLabel icon="plug" label="content" />
                  </React.Fragment>
                )}
              />
            )
          }}
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
