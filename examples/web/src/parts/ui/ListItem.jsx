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

// elements
const avatarProps = {
  key: 'avatar',
  size: 'lg',
}
const renderAvatar = z.fn(t => (props, baseProps = {}) => {
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
    off: { border: 'transparent', content: ['white', { hover: 'green-500' }] },
  },
}
const renderSelector = z.fn(t => (props, baseProps = {}) => {
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
const renderItemLabel = z.fn(t => (props, baseProps = {}) => {
  const defaultProps = t.mergeDeepRight(itemProps, baseProps)
  if (isRenderProp(props)) {
    return props(defaultProps)
  }
  const icon = t.atOr(null, 'icon', props)
  const label = t.atOr(null, 'label', props)
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
const renderListItem = z.fn(t => props => {
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
  const selectSlot = t.atOr(null, 'select', slots)
  const avatarSlot = t.atOr(null, 'avatar', slots)
  const titleSlot = t.atOr(null, 'title', slots)
  const contentSlot = t.atOr(null, 'content', slots)
  const lastSlot = t.atOr(null, 'last', slots)
  const nestedSlot = t.atOr(null, 'nested', slots)
  // select col:
  const select = t.atOr(null, 'select', props)
  // avatar col:
  const avatar = t.atOr(null, 'avatar', props)
  const caption = t.atOr(null, 'caption', props)
  const hasAvatar = t.notNil(avatar)
  const hasCaption = t.notNil(caption)
  // title col:
  const title = t.atOr(null, 'title', props)
  const subtitle = t.atOr(null, 'subtitle', props)
  const hasTitle = t.notNil(title)
  const hasSubtitle = t.notNil(subtitle)
  // content col:
  const content = t.atOr(null, 'content', props)
  const hasContent = t.notNil(content)
  // last col:
  const stamp = t.atOr(null, 'stamp', props)
  const buttons = t.atOr([], 'buttons', props)
  const hasStamp = t.notNil(stamp)
  const hasButtons = t.notZeroLen(buttons)
  // nested
  const nested = t.atOr(null, 'nested', props)
  const children = t.atOr(null, 'children', props)
  const hasNested = t.notNil(nested)
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
      'title',
      'subtitle',
      'content',
      'stamp',
      'buttons',
      'nested',
      'children',
    ],
    props
  )
  return (
    <Col {...nextProps}>
      <Row key="row-main" y="center">
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
                    selected: false,
                    onSelect,
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
                    renderAvatar(avatar, { loading, disabled, selected, title })
                  }
                />
                <When
                  is={hasCaption}
                  render={() =>
                    renderItemLabel(caption, {
                      key: 'caption',
                      label: {
                        fontSize: 'xs',
                        margin: hasAvatar ? { top: 1 } : null,
                      },
                    })
                  }
                />
              </React.Fragment>
            )
            const colProps = {
              x: 'left',
              y: 'center',
              flex: 'init',
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
          is={t.anyOf([t.notNil(titleSlot), hasTitle, hasSubtitle])}
          render={() => {
            const nextChildren = (
              <React.Fragment>
                <When
                  is={hasTitle}
                  render={() =>
                    renderItemLabel(title, {
                      key: 'title',
                      label: {
                        fontSize: subtitle ? null : 'lg',
                      },
                    })
                  }
                />
                <When
                  is={hasSubtitle}
                  render={() =>
                    renderItemLabel(subtitle, {
                      key: 'subtitle',
                      margin: hasTitle ? { top: 1 } : null,
                    })
                  }
                />
              </React.Fragment>
            )
            const colProps = {
              x: 'left',
              y: 'center',
              flex: 'init',
              padding: { x: 2 },
            }
            if (isRenderProp(titleSlot)) {
              return titleSlot({
                children: nextChildren,
                ...colProps,
              })
            }
            return (
              <Col key="slot-title" {...colProps} {...titleSlot}>
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
                  <HStack key="content" y="center" x="left" stretch>
                    {isRenderProp(content) ? content() : content}
                  </HStack>
                )}
              />
            )
            if (isRenderProp(contentSlot)) {
              return contentSlot({ children: nextChildren })
            }
            return (
              <Col key="slot-content" y="center" flex={1} {...titleSlot}>
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
          is={t.anyOf([t.notNil(lastSlot), hasStamp, hasButtons])}
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
                <When
                  is={hasButtons}
                  render={() => (
                    <Row key="buttons" x="right">
                      <MapIndexed
                        items={buttons}
                        render={(button, index) => (
                          <Button key={`li-btn-${index}`} {...button} />
                        )}
                      />
                    </Row>
                  )}
                />
              </React.Fragment>
            )
            const colProps = {
              x: 'right',
              justifyContent: 'between',
              flex: 'init',
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
          const nextChildren = <React.Fragment>{nested}</React.Fragment>
          if (isRenderProp(nestedSlot)) {
            return nestedSlot({ children: nextChildren })
          }
          return (
            <Row key="row-nested">
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
