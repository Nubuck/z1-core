import React from 'react'
import z from '@z1/lib-feature-box'
import { VStack, Match, Spinner, Icon, Button } from '@z1/lib-ui-box-elements'

// main
const renderListItem = z.fn(t => props => {
  return null
})

export class ListItem extends React.Component {
  render() {
    return renderListItem(this.props)
  }
}
ListItem.displayName = 'ListItem'
