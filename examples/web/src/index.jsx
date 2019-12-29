import React from 'react'
import ReactDom from 'react-dom'
import { featureBox as fbx } from '@z1/lib-feature-box'
import { apiClient } from '@z1/lib-api-box-client'

// hot code
import App from './App'
import features from './features'

// configure
const store = fbx.store.create({
  boxes: features.state,
  context: {
    api: apiClient({
      path:
        process.env.NODE_ENV === 'development' ? 'http://localhost:3035' : '/',
    }),
  },
})
// reload state
if (module.hot) {
  module.hot.accept(['./features'], () => {
    fbx.store.reload(store, features.state)
  })
}
// run
ReactDom.render(
  <fbx.ui.Provider store={store}>
    <App routing={features.routing} />
  </fbx.ui.Provider>,
  document.getElementById('root')
)
