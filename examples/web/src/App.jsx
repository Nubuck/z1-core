import { hot } from 'react-hot-loader'
import React from 'react'
import zbx from '@z1/lib-feature-box'

// main
const App = zbx.ui.connect(zbx.ui.query(['location']))(
  ({ location, routing }) => {
    return <div>{zbx.routing.render(location.type, routing)}</div>
  }
)

export default hot(module)(App)
