import React from 'react'
import { task } from '@z1/preset-task'

// main
const renderWhen = task(t => props => {
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
