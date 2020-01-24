import React from 'react'
import z from '@z1/lib-feature-box'

// main
const renderLogo = z.fn(t => props => {
  return null
})

export class Logo extends React.Component {
  render() {
    return renderLogo(this.props)
  }
}
Logo.displayName = 'Logo'