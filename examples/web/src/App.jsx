import { hot } from 'react-hot-loader'
import React from 'react'
import z from '@z1/lib-feature-box'

// main
const App = z.ui.connect(z.ui.query(['location']))(
  ({ location, routing }) => {
    return <div>{z.routing.render(location.type, routing)}</div>
  }
)

export default hot(module)(App)
