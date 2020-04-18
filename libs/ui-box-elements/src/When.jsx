import React from 'react'
import { fn } from '@z1/lib-ui-box'

// main
const renderWhen = fn((t) => (props) => {
  const nextProps = t.omit(['is', 'render', 'elseRender'], props)
  const is = t.atOr(false, 'is', props)
  if (t.not(is)) {
    const elseRender = t.atOr(null, 'elseRender', props)
    if (t.isNil(elseRender)) {
      return null
    }
    return elseRender(nextProps)
  }
  const render = t.atOr(null, 'render', props)
  if (t.isNil(render)) {
    return null
  }
  return render(nextProps)
})

export class When extends React.Component {
  render() {
    return renderWhen(this.props)
  }
}
When.displayName = 'When'
