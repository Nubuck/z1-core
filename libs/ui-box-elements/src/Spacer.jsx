import React from 'react'
import { fn } from '@z1/lib-ui-box'

// elements
import { renderBox } from './Box'

// main
const renderSpacer = fn((t) => (props) =>
  renderBox(
    t.merge(t.omit(['box'], props), {
      box: t.merge({ flex: 1 }, t.atOr({}, 'box', props)),
    })
  )
)

export class Spacer extends React.Component {
  render() {
    return renderSpacer(this.props)
  }
}
Spacer.displayName = 'Spacer'
