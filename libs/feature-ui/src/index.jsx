// hot code before deps
import App from './App'
// deps
import React from 'react'
import ReactDom from 'react-dom'
// configure
const run = () => {
  ReactDom.render(<App />, document.getElementById('root'))
}
// reload
if (module.hot) {
  module.hot.accept(['./elements', './App'], () => {
    run()
  })
}
// run
run()
