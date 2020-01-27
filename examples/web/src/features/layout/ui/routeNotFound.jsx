import React from 'react'

// main
export const routeNotFound = ctx => () => {
  return (
    <ctx.Page
      key="not-found"
      centered
      render={() => (
        <React.Fragment>
          <ctx.Row x='center' as="h1" fontSize="2xl" fontWeight="medium">
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
}
