import { hot } from 'react-hot-loader'
import React from 'react'
import z from '@z1/lib-feature-box'

// main
const App = z.ui.connect(z.ui.query(['location']))(props =>
  z.routing.render(props.location.type, props.routing)
)

export default hot(module)(App)
