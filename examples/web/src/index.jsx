// hot code before deps
import App from './App'
import features, { api } from './features'
import './index.css'
// deps
import React from 'react'
import ReactDom from 'react-dom'
import z from '@z1/lib-feature-box'
import 'react-virtualized/styles.css'
// configure
const dev = process.env.NODE_ENV === 'development'
const store = z.store.create({
  boxes: features.state,
  context: {
    api: api(dev ? 'http://localhost:3035' : '/'),
  },
  logging: dev,
})
const run = () => {
  ReactDom.render(
    <z.ui.Provider store={store}>
      <App routing={features.routing} />
    </z.ui.Provider>,
    document.getElementById('root')
  )
}
// reload
if (module.hot) {
  module.hot.accept(['./features', './App'], () => {
    z.store.reload(store, features.state)
    run()
  })
}
// run
run()
