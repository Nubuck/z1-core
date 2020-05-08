import React from 'react'

// elements
import { renderResponsiveStack } from './Stack'

// main
export class Col extends React.Component {
  render() {
    return renderResponsiveStack('vertical', this.props)
  }
}
Col.displayName = 'Col'
