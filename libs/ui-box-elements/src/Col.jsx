import React from 'react'
import { fn } from '@z1/lib-ui-box'

// elements
import { renderResponsiveStack } from './Stack'

// main
export class Col extends React.Component {
  render() {
    return renderResponsiveStack('vertical', this.props)
  }
}
Col.displayName = 'Col'
