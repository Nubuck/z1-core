// hot code
import App from './App'
import features from './features'
import './index.css'
// deps
import React from 'react'
import ReactDom from 'react-dom'
import zbx from '@z1/lib-feature-box'
import api from '@z1/lib-api-box-client'
// configure
const development = process.env.NODE_ENV === 'development'
const store = zbx.store.create({
  boxes: features.state,
  context: {
    api: api(development ? 'http://localhost:3035' : '/'),
  },
  logging: development,
})
// reload state
if (module.hot) {
  module.hot.accept(['./features', './App'], () => {
    zbx.store.reload(store, features.state)
  })
}
// run
ReactDom.render(
  <zbx.ui.Provider store={store}>
    <App routing={features.routing} />
  </zbx.ui.Provider>,
  document.getElementById('root')
)
