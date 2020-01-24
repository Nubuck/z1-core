import React from 'react'
import z from '@z1/lib-feature-box'

// main
const renderModal = z.fn(t => props => {
  return null
})

export class Modal extends React.Component {
  render() {
    return renderModal(this.props)
  }
}
Modal.displayName = 'Modal'