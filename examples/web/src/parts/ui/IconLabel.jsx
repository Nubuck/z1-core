import React from 'react'
import z from '@z1/lib-feature-box'
import { VStack, Match, Spinner, Icon } from '@z1/lib-ui-box-elements'

// main
const renderIconLabel = z.fn(t => props => {
  return null
})

export class IconLabel extends React.Component {
  render() {
    return renderIconLabel(this.props)
  }
}
IconLabel.displayName = 'IconLabel'