import React from 'react'
import z from '@z1/lib-feature-box'
import { VStack, Match, Spinner, Icon } from '@z1/lib-ui-box-elements'

// main
const renderAvatar = z.fn(t => props => {
  return null
})

export class Avatar extends React.Component {
  render() {
    return renderAvatar(this.props)
  }
}
Avatar.displayName = 'Avatar'
