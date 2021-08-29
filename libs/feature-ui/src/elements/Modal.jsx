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
  Spinner,
} from '@z1/lib-ui-box-elements'
import { isRenderProp } from './common'
import { renderIconLabel } from './IconLabel'
import { Fn } from './Fn'
import KeyboardEventHandler from 'react-keyboard-event-handler'

// slots
const renderSlot = z.fn((t) => (Element, baseProps, slot, children) => {
  if (isRenderProp(slot)) {
    return slot(t.merge(baseProps, { key, children }))
  }
  const nextProps = t.merge(baseProps, slot || {})
  return <Element {...nextProps}>{children}</Element>
})
const overlayBase = {
  key: 'slot-overlay',
  x: 'center',
  y: 'center',
  box: {
    position: 'fixed',
    pin: { top: true, right: true, bottom: true, left: true },
    zIndex: 50,
  },
  style: { backgroundColor: 'rgba(0,0,0,0.8)' },
}
const modalBase = {
  key: 'slot-modal',
  xs: 12,
  sm: 12,
  md: 10,
  lg: 8,
  xl: 6,
  box: {
    position: 'relative',
    alignSelf: 'auto',
    bgColor: 'gray-1000',
    borderRadius: 'sm',
    borderWidth: true,
    borderColor: 'gray-700',
  },
}
const titleBase = {
  key: 'slot-title',
  x: 'left',
  y: 'center',
  padding: { y: 2, left: 4, right: 2 },
}
const closeBase = {
  key: 'close-button',
  icon: 'close',
  size: 'sm',
  shape: 'circle',
  fill: 'ghost-solid',
  color: 'blue-500',
  box: {
    borderRadius: 'sm',
  },
}
const contentBase = {
  key: 'slot-content',
  box: {
    padding: {
      top: 2,
      x: 4,
      bottom: 4,
    },
  },
  overflowY: 'auto',
  className: 'scrollbar outline-none',
  style: {
    maxHeight: '85vh',
  },
}
const buttonsBase = {
  key: 'slot-buttons',
  x: 'right',
  y: 'center',
  box: {
    padding: {
      top: 0,
      x: 4,
      bottom: 4,
    },
  },
}

// main
const renderModal = z.fn((t) => (props) => {
  // status:
  const open = t.atOr(false, 'open', props)
  const loading = t.atOr(false, 'loading', props)
  // layout:
  const slots = t.atOr({}, 'slots', props)
  const loadingSlot = t.atOr({}, 'loading', slots)
  const overlaySlot = t.at('overlay', slots)
  const contentSlot = t.at('content', slots)
  const titleSlot = t.at('title', slots)
  const closeSlot = t.at('close', slots)
  const buttonSlot = t.at('buttons', slots)
  // title slot:
  const title = t.at('title', props)
  // butons:
  const buttons = t.atOr([], 'buttons', props)
  // handlers
  const onClose = t.atOr(() => {}, 'onClose', props)
  // element
  const nextProps = t.omit(
    ['open', 'loading', 'onClose', 'slots', 'title', 'buttons', 'children'],
    props
  )
  return t.not(open)
    ? null
    : renderSlot(
        VStack,
        overlayBase,
        overlaySlot,
        renderSlot(
          Col,
          modalBase,
          nextProps,
          <React.Fragment>
            <Fn
              render={() =>
                renderSlot(
                  Row,
                  titleBase,
                  titleSlot,
                  <React.Fragment>
                    <When
                      is={t.notNil(title)}
                      render={() => {
                        const titleProps = t.isType(title, 'string')
                          ? { label: title }
                          : title
                        return renderIconLabel(titleProps)
                      }}
                    />
                    <Spacer />
                    {renderSlot(
                      Button,
                      t.merge(closeBase, { onClick: onClose }, closeSlot, null)
                    )}
                  </React.Fragment>
                )
              }
            />
            <When
              key="when-is-loading"
              is={t.eq(true, loading)}
              render={() => (
                <Col
                  key="loading"
                  x="center"
                  y="center"
                  flex={1}
                  style={{ minHeight: '60vh' }}
                  {...loadingSlot}
                >
                  <Spinner size="lg" color={t.atOr('white', 'color', props)} />
                </Col>
              )}
              elseRender={() => (
                <React.Fragment>
                  <Fn
                    key="content-slot"
                    render={() =>
                      renderSlot(Col, contentBase, contentSlot, props.children)
                    }
                  />
                  <When
                    key="when-has-buttons"
                    is={t.hasLen(buttons)}
                    render={() =>
                      renderSlot(
                        Row,
                        buttonsBase,
                        buttonSlot,
                        <MapIndexed
                          items={buttons}
                          render={(button, index) => (
                            <Button key={`modal-btn-${index}`} {...button} />
                          )}
                        />
                      )
                    }
                  />
                </React.Fragment>
              )}
            />
          </React.Fragment>
        )
      )
})

export const Modal = z.fn((t) => (props) => {
  const onClose = t.atOr(() => {}, 'onClose', props)
  return (
    <React.Fragment>
      <KeyboardEventHandler
        handleKeys={['esc']}
        onKeyEvent={(key, e) => onClose()}
      />
      {renderModal(props)}
    </React.Fragment>
  )
})
