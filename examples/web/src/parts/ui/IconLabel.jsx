import React from 'react'
import z from '@z1/lib-feature-box'
import { Row, Col, When, Icon, Box } from '@z1/lib-ui-box-elements'

// elements
const isRenderProp = z.fn(t => prop =>
  t.isNil(prop) ? false : t.isType(prop, 'function')
)
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
const textProps = {
  x: 'left',
  y: 'center',
  box: { display: 'inline-flex', alignSelf: 'auto' },
}
const renderText = z.fn(t => (props, baseProps = {}) => {
  const defaultProps = t.mergeDeepRight(textProps, baseProps)
  if (isRenderProp(props)) {
    return props(defaultProps)
  }
  if (t.isType(props, 'string')) {
    return <Row {...defaultProps}>{props}</Row>
  }
  const text = t.pathOr(null, ['text'], props)
  if (t.notNil(text)) {
    const nextProps = t.omit(['text'], props)
    return (
      <Row {...defaultProps} {...nextProps}>
        {text}
      </Row>
    )
  }
  const nextProps = t.omit(['children'], props)
  return (
    <Box {...defaultProps} {...nextProps}>
      {props.children}
    </Box>
  )
})
const Left = ({ children, ...props }) => {
  return (
    <Col x="center" justifyContent="between" {...props}>
      {children}
    </Col>
  )
}
Left.displayName = 'Left'
const Right = ({ children, ...props }) => {
  return (
    <Col x="center" justifyContent="between" {...props}>
      {children}
    </Col>
  )
}
Right.displayName = 'Right'

// main
const renderIconLabel = z.fn(t => props => {
  // left col
  const left = t.pathOr(null, ['left'], props)
  const icon = t.pathOr(null, ['icon'], props)
  const caption = t.pathOr(null, ['caption'], props)
  const hasleft = t.notNil(left)
  const hasIcon = t.notNil(icon)
  const hasCaption = t.notNil(caption)
  // right col
  const right = t.pathOr(null, ['right'], props)
  const label = t.pathOr(null, ['label'], props)
  const info = t.pathOr(null, ['info'], props)
  const children = t.pathOr(null, ['children'], props)
  const hasRight = t.notNil(right)
  const hasLabel = t.notNil(label)
  const hasInfo = t.notNil(info)
  const hasChildren = t.notNil(children)
  // box
  const nextProps = t.omit(
    ['icon', 'caption', 'label', 'info', 'children'],
    props
  )
  return (
    <Row
      x="left"
      y="center"
      display="inline-flex"
      alignSelf="auto"
      {...nextProps}
    >
      <When
        is={t.or(hasIcon, hasCaption)}
        render={() => {
          const nextChildren = (
            <React.Fragment>
              <When
                is={hasIcon}
                render={() => renderIcon(icon, { key: 'caption' })}
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
          if (isRenderProp(left)) {
            return left({
              x: 'center',
              justifyContent: 'between',
              children: nextChildren,
            })
          }
          const nextProps = hasleft ? left : {}
          return <Left {...nextProps}>{nextChildren}</Left>
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
                    y: 'bottom',
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
          if (isRenderProp(right)) {
            return right({
              x: 'center',
              justifyContent: 'between',
              children: nextChildren,
            })
          }
          const nextProps = hasRight ? right : {}
          return <Right {...nextProps}>{nextChildren}</Right>
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
