// hot code before deps
import App from './App'
// deps
import React from 'react'
import ReactDom from 'react-dom'
import '@z1/lib-feature-ui/dist/index.css'
import 'react-virtualized/styles.css'
import 'react-sortable-tree/style.css'
// configure
const run = () => {
  ReactDom.render(<App />, document.getElementById('root'))
}
// reload
if (module.hot) {
  module.hot.accept(['./elements', './ui', './App'], () => {
    run()
  })
}
// run
run()
