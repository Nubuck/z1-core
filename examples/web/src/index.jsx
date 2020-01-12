import './index.css'
import React from 'react'
import ReactDom from 'react-dom'
import zbx from '@z1/lib-feature-box'
import api from '@z1/lib-api-box-client'

// hot code
import App from './App'
import features from './features'

// configure
const store = zbx.store.create({
  boxes: features.state,
  context: {
    api: api(
      process.env.NODE_ENV === 'development' ? 'http://localhost:3035' : '/'
    ),
  },
})
// reload state
if (module.hot) {
  module.hot.accept(['./features'], () => {
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
