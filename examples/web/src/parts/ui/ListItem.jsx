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
  size: 'xl',
  selected: false,
  
}
const renderSelector = z.fn(t => (props, baseProps = {}) => {
  const defaultProps = t.mergeDeepRight(selectorProps, baseProps)
  if (isRenderProp(props)) {
    return props(defaultProps)
  }
  // if (t.isType(props, 'string')) {
  //   return <Button {...defaultProps} name={props} />
  // }
  return <Button {...defaultProps} {...props} />
})
const renderItemLabel = z.fn(t => (props, baseProps = {}) => {
  const defaultProps = t.mergeDeepRight(selectorProps, baseProps)
  if (isRenderProp(props)) {
    return props(defaultProps)
  }
  const icon = t.pathOr(null, ['icon'], props)
  const label = t.pathOr(null, ['label'], props)
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
  const selectable = t.pathOr(false, ['selectable'], props)
  // status:
  const loading = t.pathOr(false, ['loading'], props)
  const disabled = t.pathOr(false, ['disabled'], props)
  const selected = t.pathOr(false, ['selected'], props)
  // actions:
  const onSelect = t.pathOr(() => null, ['onSelect'], props)
  // layout:
  const cols = t.pathOr({}, ['cols'], props)
  const colSelect = t.pathOr(null, ['select'], cols)
  const colAvatar = t.pathOr(null, ['avatar'], cols)
  const colTitle = t.pathOr(null, ['title'], cols)
  const colContent = t.pathOr(null, ['content'], cols)
  const colLast = t.pathOr(null, ['last'], cols)
  const colNested = t.pathOr(null, ['nested'], cols)
  // select col:
  const select = t.pathOr(null, ['select'], props)
  // avatar col:
  const avatar = t.pathOr(null, ['avatar'], props)
  const caption = t.pathOr(null, ['caption'], props)
  const hasAvatar = t.notNil(avatar)
  const hasCaption = t.notNil(caption)
  // title col:
  const title = t.pathOr(null, ['title'], props)
  const subtitle = t.pathOr(null, ['subtitle'], props)
  const hasTitle = t.notNil(title)
  const hasSubtitle = t.notNil(subtitle)
  // content col:
  const content = t.pathOr(null, ['content'], props)
  const hasContent = t.notNil(content)
  // last col:
  const stamp = t.pathOr(null, ['stamp'], props)
  const buttons = t.pathOr([], ['buttons'], props)
  const hasStamp = t.notNil(stamp)
  const hasButtons = t.notZeroLen(buttons)
  // nested
  const nested = t.pathOr(null, ['nested'], props)
  const children = t.pathOr(null, ['children'], props)
  const hasNested = t.notNil(nested)
  // colors: on / off / selected
  // const colors = t.pathOr(null, ['colors'], props)
  // const color = t.pathOr(null, ['color'], props)
  const nextProps = t.omit(
    [
      'selectable',
      'loading',
      'disabled',
      'selected',
      'onSelect',
      'cols',
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
      // 'colors',
      // 'color',
    ],
    props
  )
  return (
    <Col {...nextProps}>
      <Row key="row-main" y="center">
        <When
          is={t.anyOf([t.notNil(colSelect), selectable])}
          render={() => {
            const nextChildren = (
              <When
                is={selectable}
                render={() =>
                  renderSelector(select, {
                    loading,
                    disabled,
                    selected,
                    onSelect,
                  })
                }
              />
            )
            const colProps = {
              y: 'center',
              x: 'center',
              flex: 'init',
            }
            if (isRenderProp(colSelect)) {
              return colSelect({
                children: nextChildren,
                loading,
                disabled,
                selected,
                onSelect,
                ...colProps,
              })
            }
            return (
              <Col key="col-select" {...colProps} {...colSelect}>
                {nextChildren}
              </Col>
            )
          }}
        />
        <When
          is={t.anyOf([t.notNil(colAvatar), hasAvatar, hasCaption])}
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
            if (isRenderProp(colAvatar)) {
              return colAvatar({
                children: nextChildren,
                ...colProps,
              })
            }
            return (
              <Col key="col-avatar" {...colProps} {...colAvatar}>
                {nextChildren}
              </Col>
            )
          }}
        />
        <When
          is={t.anyOf([t.notNil(colTitle), hasTitle, hasSubtitle])}
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
            if (isRenderProp(colTitle)) {
              return colTitle({
                children: nextChildren,
                ...colProps,
              })
            }
            return (
              <Col key="col-title" {...colProps} {...colTitle}>
                {nextChildren}
              </Col>
            )
          }}
        />
        <When
          is={t.anyOf([t.notNil(colContent), hasContent])}
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
            if (isRenderProp(colContent)) {
              return colContent({ children: nextChildren })
            }
            return (
              <Col key="col-content" y="center" flex={1} {...colTitle}>
                {nextChildren}
              </Col>
            )
          }}
        />
        <When
          is={t.allOf([t.isNil(colContent), t.not(hasContent)])}
          render={() => <Spacer />}
        />
        <When
          is={t.anyOf([t.notNil(colLast), hasStamp, hasButtons])}
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
              // alignSelf: 'end',
              flex: 'init',
            }
            if (isRenderProp(colLast)) {
              return colLast({
                children: nextChildren,
                ...colProps,
              })
            }
            return (
              <Col key="col-last" {...colProps} {...colLast}>
                {nextChildren}
              </Col>
            )
          }}
        />
      </Row>
      <When
        is={t.anyOf([
          t.notNil(colNested),
          hasNested,
          t.isNil(children) ? false : t.gt(React.Children.count(children), 0),
        ])}
        render={() => {
          const nextChildren = <React.Fragment></React.Fragment>
          if (isRenderProp(colNested)) {
            return colNested({ children: nextChildren })
          }
          return (
            <Row key="row-nested">
              <Col key="col-nested" {...colNested}>
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
