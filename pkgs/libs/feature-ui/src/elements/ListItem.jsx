import React from 'react'
import z from '@z1/lib-feature-box'
import {
  Row,
  Col,
  HStack,
  When,
  Button,
  Avatar,
  MapIndexed,
  Spacer,
} from '@z1/lib-ui-box-elements'
import { isRenderProp } from './common'
import { renderIconLabel } from './IconLabel'
import { renderSegment } from './Segment'

// elements
const avatarProps = {
  key: 'avatar',
  size: 'lg',
}
const renderAvatar = z.fn((t) => (props, baseProps = {}) => {
  const defaultProps = t.mergeDeepRight(avatarProps, baseProps)
  if (isRenderProp(props)) {
    return props(defaultProps)
  }
  return (
    <Row x="center" y="center" key="row-avatar">
      <Avatar {...defaultProps} {...props} />
    </Row>
  )
})
const selectorProps = {
  key: 'selector',
  size: 'sm',
  selected: false,
  shape: 'circle',
  fill: 'custom',
  colors: {
    on: { border: 'transparent', content: 'green-500' },
    off: { border: 'transparent', content: ['gray-400', { hover: 'green-500' }] },
  },
}
const renderSelector = z.fn((t) => (props, baseProps = {}) => {
  const defaultProps = t.mergeDeepRight(selectorProps, baseProps)
  if (isRenderProp(props)) {
    return props(defaultProps)
  }
  return (
    <Button
      icon={{
        name: defaultProps.selected ? 'check-circle' : 'plus-circle',
      }}
      {...defaultProps}
      {...props}
    />
  )
})
const itemProps = {
  size: 'md',
}
const renderItemLabel = z.fn((t) => (props, baseProps = {}) => {
  const defaultProps = t.mergeDeepRight(itemProps, baseProps)
  if (isRenderProp(props)) {
    return props(defaultProps)
  }
  const icon = t.at('icon', props)
  const label = t.at('label', props)
  return renderIconLabel(
    t.merge(
      defaultProps,
      t.merge(props, {
        icon: t.merge(
          defaultProps.icon || {},
          t.isType(icon, 'string') ? { name: icon } : icon
        ),
        label: t.merge(
          defaultProps.label || {},
          t.isType(label, 'string') ? { text: label } : label
        ),
      })
    )
  )
})

// main
const renderListItem = z.fn((t) => (props) => {
  // mode:
  const selectable = t.atOr(false, 'selectable', props)
  // status:
  const loading = t.atOr(false, 'loading', props)
  const disabled = t.atOr(false, 'disabled', props)
  const selected = t.atOr(false, 'selected', props)
  // actions:
  const onSelect = t.atOr(() => null, 'onSelect', props)
  // layout:
  const slots = t.atOr({}, 'slots', props)
  const mainSlot = t.atOr({}, 'main', slots)
  const auxSlot = t.atOr({}, 'aux', slots)
  const selectSlot = t.at('select', slots)
  const avatarSlot = t.at('avatar', slots)
  const headingSlot = t.at('heading', slots)
  const contentSlot = t.at('content', slots)
  const innerSlot = t.at('inner', slots)
  const lastSlot = t.at('last', slots)
  const buttonSlot = t.at('buttons', slots)
  const nestedSlot = t.at('nested', slots)
  // select col:
  const select = t.at('select', props)
  // avatar col:
  const avatar = t.at('avatar', props)
  const caption = t.at('caption', props)
  const hasAvatar = t.notNil(avatar)
  const hasCaption = t.notNil(caption)
  // heading col:
  const heading = t.at('heading', props)
  const subheading = t.at('subheading', props)
  const hasHeading = t.notNil(heading)
  const hasSubheading = t.notNil(subheading)
  // content col:
  const content = t.at('content', props)
  const hasContent = t.notNil(content)
  // last col:
  const stamp = t.at('stamp', props)
  const status = t.at('status', props)
  const buttons = t.atOr([], 'buttons', props)
  const segment = t.at('segment', props)
  const hasStamp = t.notNil(stamp)
  const hasStatus = t.notNil(status)
  const hasButtons = t.hasLen(buttons)
  const hasSegment = t.hasLen(segment)
  // nested
  const nested = t.at('nested', props)
  const children = t.at('children', props)
  const hasNested = t.notNil(nested)
  // element
  const nextProps = t.omit(
    [
      'selectable',
      'loading',
      'disabled',
      'selected',
      'onSelect',
      'slots',
      'select',
      'avatar',
      'caption',
      'heading',
      'subheading',
      'content',
      'stamp',
      'status',
      'buttons',
      'nested',
      'children',
      'box',
    ],
    props
  )
  const box = t.atOr({}, 'box', props)
  return (
    <Col box={{ overflow: 'hidden', ...box }} {...nextProps}>
      <Row key="slot-main" y="center" flexWrap="none" {...mainSlot}>
        <When
          is={t.anyOf([t.notNil(selectSlot), selectable])}
          render={() => {
            const nextChildren = (
              <When
                is={selectable}
                render={() =>
                  renderSelector(select, {
                    loading,
                    disabled,
                    selected,
                    onClick: (e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      onSelect && onSelect()
                    },
                  })
                }
              />
            )
            const colProps = {
              y: 'center',
              x: 'center',
              flex: 'init',
              padding: { right: 1 },
            }
            if (isRenderProp(selectSlot)) {
              return selectSlot({
                children: nextChildren,
                loading,
                disabled,
                selected,
                onSelect,
                ...colProps,
              })
            }
            return (
              <Col key="slot-select" {...colProps} {...selectSlot}>
                {nextChildren}
              </Col>
            )
          }}
        />
        <When
          is={t.anyOf([t.notNil(avatarSlot), hasAvatar, hasCaption])}
          render={() => {
            const nextChildren = (
              <React.Fragment>
                <When
                  is={hasAvatar}
                  render={() =>
                    renderAvatar(avatar, { loading, disabled, selected })
                  }
                />
                <When
                  is={hasCaption}
                  render={() =>
                    renderItemLabel(caption, {
                      key: 'caption',
                      label: {
                        fontSize: 'xs',
                        margin: hasAvatar ? { top: 1, left: 0 } : 0,
                      },
                    })
                  }
                />
              </React.Fragment>
            )
            const colProps = {
              x: 'center',
              y: 'center',
              flex: 'initial',
              flexShrink: true,
            }
            if (isRenderProp(avatarSlot)) {
              return avatarSlot({
                children: nextChildren,
                ...colProps,
              })
            }
            return (
              <Col key="slot-avatar" {...colProps} {...avatarSlot}>
                {nextChildren}
              </Col>
            )
          }}
        />
        <When
          is={t.anyOf([t.notNil(headingSlot), hasHeading, hasSubheading])}
          render={() => {
            const nextChildren = (
              <React.Fragment>
                <When
                  is={hasHeading}
                  render={() =>
                    renderItemLabel(heading, {
                      key: 'heading',
                      label: {
                        fontSize: subheading ? null : 'lg',
                      },
                    })
                  }
                />
                <When
                  is={hasSubheading}
                  render={() =>
                    renderItemLabel(subheading, {
                      key: 'subheading',
                      margin: hasHeading ? { top: 1 } : null,
                    })
                  }
                />
              </React.Fragment>
            )
            const colProps = {
              x: 'left',
              y: 'center',
              flex: 'initial',
              flexShrink: true,
              padding: { x: 2 },
              wordBreak: 'truncate',
            }
            if (isRenderProp(headingSlot)) {
              return headingSlot({
                children: nextChildren,
                ...colProps,
              })
            }
            return (
              <Col key="slot-heading" {...colProps} {...headingSlot}>
                {nextChildren}
              </Col>
            )
          }}
        />
        <When
          is={t.anyOf([t.notNil(contentSlot), hasContent])}
          render={() => {
            const nextChildren = (
              <When
                is={hasContent}
                render={() => (
                  <HStack key="content" y="top" x="left" stretch {...innerSlot}>
                    {isRenderProp(content) ? content({}) : content}
                  </HStack>
                )}
              />
            )
            if (isRenderProp(contentSlot)) {
              return contentSlot({ children: nextChildren })
            }
            return (
              <Col key="slot-content" y="center" flex={1} {...contentSlot}>
                {nextChildren}
              </Col>
            )
          }}
        />
        <When
          is={t.allOf([t.isNil(contentSlot), t.not(hasContent)])}
          render={() => <Spacer />}
        />
        <When
          is={t.anyOf([
            t.notNil(lastSlot),
            hasStamp,
            hasStatus,
            hasButtons,
            hasSegment,
          ])}
          render={() => {
            const nextChildren = (
              <React.Fragment>
                <When
                  is={hasStamp}
                  render={() =>
                    renderItemLabel(stamp, {
                      key: 'stamp',
                      icon: { size: 'md' },
                      label: { fontSize: 'xs' },
                    })
                  }
                />
                <Row
                  key="slot-buttons"
                  x="right"
                  y="center"
                  flexWrap="none"
                  {...buttonSlot}
                >
                  <When
                    is={hasStatus}
                    render={() =>
                      renderItemLabel(status, {
                        key: 'status',
                        icon: { size: 'md' },
                        label: { fontSize: 'xs' },
                        padding: hasButtons ? { right: 2 } : null,
                      })
                    }
                  />
                  <When
                    is={hasButtons}
                    render={() => (
                      <MapIndexed
                        items={buttons}
                        render={(button, index) => (
                          <Button key={`li-btn-${index}`} {...button} />
                        )}
                      />
                    )}
                  />
                  <When
                    is={hasSegment}
                    render={() => {
                      return renderSegment(segment)
                    }}
                  />
                </Row>
              </React.Fragment>
            )
            const colProps = {
              x: 'right',
              justifyContent: 'between',
              flex: 'initial',
            }
            if (isRenderProp(lastSlot)) {
              return lastSlot({
                children: nextChildren,
                ...colProps,
              })
            }
            return (
              <Col key="slot-last" {...colProps} {...lastSlot}>
                {nextChildren}
              </Col>
            )
          }}
        />
      </Row>
      <When
        is={t.anyOf([
          t.notNil(nestedSlot),
          hasNested,
          t.isNil(children) ? false : t.gt(React.Children.count(children), 0),
        ])}
        render={() => {
          const nextChildren = (
            <React.Fragment>
              <When
                key="nested"
                is={hasNested}
                render={() => (isRenderProp(nested) ? nested({}) : nested)}
              />
              <When
                key="children"
                is={
                  t.isNil(children)
                    ? false
                    : t.gt(React.Children.count(children), 0)
                }
                render={() => children}
              />
            </React.Fragment>
          )
          if (isRenderProp(nestedSlot)) {
            return nestedSlot({ children: nextChildren })
          }
          return (
            <Row key="slot-aux" y="center" {...auxSlot}>
              <Col key="slot-nested" width="full" {...nestedSlot}>
                {nextChildren}
              </Col>
            </Row>
          )
        }}
      />
    </Col>
  )
})

export class ListItem extends React.Component {
  render() {
    return renderListItem(this.props)
  }
}
ListItem.displayName = 'ListItem'
