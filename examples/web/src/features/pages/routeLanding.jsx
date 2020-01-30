import React from 'react'

// main
export const routeLanding = ui => () => (
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
          slots={{
            icon: { x: 'center', margin: { bottom: 3 } },
            label: { x: 'center' },
          }}
        />
        <ui.Button
          as={ui.Link}
          label="Get Started"
          to="/account/sign-up"
          size="lg"
          shape="pill"
          fill="outline"
          color="blue-500"
        />
      </React.Fragment>
    )}
  />
)
