import React from 'react'

// parts
import { renderNode } from './renderNode'

// eslint-disable-next-line react/prefer-stateless-function
export class ProNode extends React.Component {
  render() {
    return renderNode(this.props)
  }
}

ProNode.defaultProps = {
  buttons: [],
  canDrag: false,
  canDrop: false,
  className: '',
  draggedNode: null,
  icons: [],
  isSearchFocus: false,
  isSearchMatch: false,
  parentNode: null,
  style: {},
  subtitle: null,
  swapDepth: null,
  swapFrom: null,
  swapLength: null,
  title: null,
  toggleChildrenVisibility: null,
}
