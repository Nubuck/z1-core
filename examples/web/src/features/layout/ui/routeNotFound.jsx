import React from 'react'

// main
export const routeNotFound = ui => () => {
  return (
    <ui.Page
      key="not-found"
      centered
      render={() => (
        <React.Fragment>
          <ui.IconLabel
            icon={{ name: 'route', size: '6xl', color: 'blue-500' }}
            label={{ text: '404', fontWeight: 'bold', fontSize: '4xl' }}
            info={{
              text: 'Way off route',
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
          <ui.Button
            as={ui.Link}
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
