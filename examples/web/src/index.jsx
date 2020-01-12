import './index.css'
import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'react-redux'
import zbx from '@z1/lib-feature-box'
import api from '@z1/lib-api-box-client'
console.log('step 1')
// hot code
import App from './App'
import { features } from './features'
console.log('step 2', features)
// configure
const store = zbx.store.create({
  boxes: features.state,
  context: {
    // api: api(
    //   process.env.NODE_ENV === 'development' ? 'http://localhost:3035' : '/'
    // ),
  },
})
console.log('step 3', store.getState())
// reload state
if (module.hot) {
  module.hot.accept(['./features', './App'], () => {
    zbx.store.reload(store, features.state)
  })
}
// run
ReactDom.render(
  <Provider store={store}>
    <App routing={features.routing} />
  </Provider>,
  document.getElementById('root')
)
