import React from 'react'
import z from '@z1/lib-feature-box'
import { Row, Col, When, Icon } from '@z1/lib-ui-box-elements'
import { isRenderProp, renderText } from './common'

// elements
const iconProps = {
  key: 'icon',
  size: '2xl',
}
const renderIcon = z.fn((t) => (props, baseProps = {}) => {
  const defaultProps = t.mergeDeepRight(iconProps, baseProps)
  if (isRenderProp(props)) {
    return props(defaultProps)
  }
  if (t.isType(props, 'string')) {
    return <Icon {...defaultProps} name={props} />
  }
  const nextProps = t.merge(defaultProps, props)
  return <Icon {...nextProps} />
})

// main
export const renderIconLabel = z.fn((t) => (props) => {
  const slots = t.atOr({}, 'slots', props)
  // iconSlot col
  const iconSlot = t.at('icon', slots)
  const icon = t.at('icon', props)
  const caption = t.at('caption', props)
  const hasIcon = t.notNil(icon)
  const hasCaption = t.notNil(caption)
  // labelSlot col
  const labelSlot = t.at('label', slots)
  const label = t.at('label', props)
  const info = t.at('info', props)
  const children = t.at('children', props)
  const hasLabel = t.notNil(label)
  const hasInfo = t.notNil(info)
  const hasChildren = t.isNil(children)
    ? false
    : t.gt(React.Children.count(children), 0)
  // element
  const nextProps = t.merge(
    t.omit(
      ['slots', 'icon', 'caption', 'label', 'info', 'children', 'box'],
      props
    ),
    {
      box: t.merge(
        {
          display: 'inline-flex',
          alignSelf: 'auto',
          flexWrap: false,
        },
        t.atOr({}, 'box', props)
      ),
    }
  )
  return (
    <Row x="left" y="center" {...nextProps}>
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
          const nextProps = t.notNil(iconSlot) ? iconSlot : { flex: 'none' }
          return (
            <Col key="slot-icon" {...colProps} {...nextProps}>
              {nextChildren}
            </Col>
          )
        }}
      />
      <When
        is={t.anyOf([hasLabel, hasInfo])}
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
                    box: { fontSize: 'xs' },
                    ...spacing,
                  })
                }
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
            <Col key="slot-label" {...colProps} {...nextProps}>
              {nextChildren}
            </Col>
          )
        }}
      />
      <When
        is={hasChildren}
        render={() => <React.Fragment>{children}</React.Fragment>}
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
