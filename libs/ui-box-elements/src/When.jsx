import React from 'react'
import { fn } from '@z1/lib-ui-box'

// main
const renderWhen = fn(t => props => {
  const is = t.pathOr(false, ['is'], props)
  return t.not(is)
    ? null
    : React.createElement(React.Fragment, t.omit(['is'], props))
})

export class When extends React.Component {
  render() {
    return renderWhen(this.props)
  }
}
