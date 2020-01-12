import { hot } from 'react-hot-loader'
import React from 'react'
import { connect } from 'react-redux'
import zbx from '@z1/lib-feature-box'

// main
// const App = zbx.ui.connect(zbx.ui.query(['location']))(
//   ({ location, routing }) => {
//     return <div>{zbx.routing.render(location.type, routing)}</div>
//   }
// )

const App = connect(zbx.ui.query(['location']))(({ location }) => {
  return (
    <div>
      <h1>App</h1>
    </div>
  )
})
export default App
