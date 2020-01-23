import React from 'react'
import { fn } from '@z1/lib-ui-box'

// main
const renderWhen = fn(t => props => {
  const is = t.pathOr(false, ['is'], props)
  if (t.not(is)) {
    return null
  }
  const render = t.pathOr(null, ['render'], props)
  if (t.isNil(render)) {
    return null
  }
  return render(t.omit(['is', 'render'], props))
})

export class When extends React.Component {
  render() {
    return renderWhen(this.props)
  }
}
When.displayName = 'When'