import React from 'react'
import z from '@z1/lib-feature-box'
import {
  VStack,
  Row,
  Col,
  When,
  Button,
  MapIndexed,
  Spacer,
} from '@z1/lib-ui-box-elements'

// parts

// main
const renderModal = z.fn(t => props => {
  // status:
  const open = t.atOr(false, 'open', props)
  const loading = t.atOr(false, 'loading', props)
  // layout:
  const slots = t.atOr({}, 'slots', props)
  const overlaySlot = t.at('overlay', slots)
  const contentSlot = t.at('content', slots)
  const titleSlot = t.at('title', slots)
  const buttonSlot = t.at('buttons', slots)
  // title slot:
  const title = t.at('title', props)
  // butons
  const buttons = t.atOr([], 'buttons', props)
  const hasButtons = t.hasLen(buttons)
  // element
  const nextProps = t.omit(
    ['open', 'loading', 'onClose', 'slots', 'title', 'buttons', 'children'],
    props
  )
  return t.not(open) ? null : (
    <VStack
      x="center"
      y="center"
      box={{
        position: 'fixed',
        pin: { top: true, right: true, bottom: true, left: true },
        zIndex: 50,
      }}
      style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
    >
      <Row>
        <When is={t.notNil(title)} render={() => {}} />
        <Spacer />
        <Button
          icon="close"
          size="sm"
          shape="circle"
          fill="ghost-solid"
          colors={{ off: 'blue-500', on: 'yellow-500' }}
        />
      </Row>
      <Col></Col>
      <Row></Row>
    </VStack>
  )
})

export class Modal extends React.Component {
  render() {
    return renderModal(this.props)
  }
}
Modal.displayName = 'Modal'
