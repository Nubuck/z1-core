// hot code
import App from './App'
import features, { withRest } from './features'
import './index.css'
import 'react-virtualized/styles.css'
// deps
import React from 'react'
import ReactDom from 'react-dom'
import z from '@z1/lib-feature-box'
import api from '@z1/lib-api-box-client'
// configure
const dev = process.env.NODE_ENV === 'development'
const store = z.store.create({
  boxes: features.state,
  context: {
    api: withRest(api(dev ? 'http://localhost:3035' : '/')),
  },
  logging: dev,
})
// reload state
if (module.hot) {
  module.hot.accept(['./features', './App'], () => {
    z.store.reload(store, features.state)
  })
}
// run
ReactDom.render(
  <z.ui.Provider store={store}>
    <App routing={features.routing} />
  </z.ui.Provider>,
  document.getElementById('root')
)
