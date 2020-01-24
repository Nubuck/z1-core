import React from 'react'
import z from '@z1/lib-feature-box'
import { VStack } from '@z1/lib-ui-box-elements'
import { AutoSizer, List } from 'react-virtualized'

// main
const renderVList = z.fn(t => props => {
  return (
    <VStack x="left" y="top" box={{ flex: 1, height: 'full' }}>
      <AutoSizer>{({ width, height }) => <List />}</AutoSizer>
    </VStack>
  )
})

export class VList extends React.Component {
  render() {
    return renderVList(this.props)
  }
}
VList.displayName = 'VList'
