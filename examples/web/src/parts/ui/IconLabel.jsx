import React from 'react'
import z from '@z1/lib-feature-box'
import { Row, Col, When, Icon } from '@z1/lib-ui-box-elements'
import { isRenderProp, renderText } from './common'

// elements
const iconProps = {
  key: 'icon',
  size: '2xl',
}
const renderIcon = z.fn(t => (props, baseProps = {}) => {
  const defaultProps = t.mergeDeepRight(iconProps, baseProps)
  if (isRenderProp(props)) {
    return props(defaultProps)
  }
  if (t.isType(props, 'string')) {
    return <Icon {...defaultProps} name={props} />
  }
  return <Icon {...defaultProps} {...props} />
})

// main
export const renderIconLabel = z.fn(t => props => {
  const slots = t.atOr({}, 'slots', props)
  // iconSlot col
  const iconSlot = t.atOr(null, 'icon', slots)
  const icon = t.atOr(null, 'icon', props)
  const caption = t.atOr(null, 'caption', props)
  const hasIcon = t.and(t.notNil(icon), t.notEmpty(icon))
  const hasCaption = t.and(t.notNil(caption), t.notEmpty(caption))
  // labelSlot col
  const labelSlot = t.atOr(null, 'label', slots)
  const label = t.atOr(null, 'label', props)
  const info = t.atOr(null, 'info', props)
  const children = t.atOr(null, 'children', props)
  const hasLabel = t.and(t.notNil(label), t.notEmpty(label))
  const hasInfo = t.and(t.notNil(info), t.notEmpty(info))
  const hasChildren = t.isNil(children)
    ? false
    : t.gt(React.Children.count(children), 0)
  // element
  const nextProps = t.omit(
    ['slots', 'icon', 'caption', 'label', 'info', 'children'],
    props
  )
  return (
    <Row
      x="left"
      y="center"
      box={{
        display: 'inline-flex',
        alignSelf: 'auto',
      }}
      {...nextProps}
    >
      <When
        is={t.or(hasIcon, hasCaption)}
        render={() => {
          const nextChildren = (
            <React.Fragment>
              <When
                is={hasIcon}
                render={() => renderIcon(icon, { key: 'icon' })}
              />
              <When
                is={hasCaption}
                render={() =>
                  renderText(caption, {
                    key: 'caption',
                    y: 'bottom',
                    box: { fontSize: 'xs' },
                  })
                }
              />
            </React.Fragment>
          )
          const colProps = {
            y: 'center',
            x: 'center',
          }
          if (isRenderProp(iconSlot)) {
            return iconSlot({
              children: nextChildren,
              ...colProps,
            })
          }
          const nextProps = t.notNil(iconSlot) ? iconSlot : {}
          return (
            <Col key="col-icon-slot" {...colProps} {...nextProps}>
              {nextChildren}
            </Col>
          )
        }}
      />
      <When
        is={t.anyOf([hasLabel, hasInfo, hasChildren])}
        render={() => {
          const spacing = t.or(hasIcon, hasCaption)
            ? { box: { margin: { left: 1 } } }
            : {}
          const nextChildren = (
            <React.Fragment>
              <When
                is={hasLabel}
                render={() => renderText(label, { ...spacing, key: 'label' })}
              />
              <When
                is={hasInfo}
                render={() =>
                  renderText(info, {
                    key: 'info',
                    box: { fontSize: 'xs', ...spacing },
                  })
                }
              />
              <When
                is={hasChildren}
                render={() => <React.Fragment>{children}</React.Fragment>}
              />
            </React.Fragment>
          )
          const colProps = {
            y: 'center',
            x: 'left',
          }
          if (isRenderProp(labelSlot)) {
            return labelSlot({
              children: nextChildren,
              ...colProps,
            })
          }
          const nextProps = t.notNil(labelSlot) ? labelSlot : {}
          return (
            <Col key="col-label-slot" {...colProps} {...nextProps}>
              {nextChildren}
            </Col>
          )
        }}
      />
    </Row>
  )
})

export class IconLabel extends React.Component {
  render() {
    return renderIconLabel(this.props)
  }
}
IconLabel.displayName = 'IconLabel'
