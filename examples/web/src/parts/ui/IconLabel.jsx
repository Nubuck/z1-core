import React from 'react'
import z from '@z1/lib-feature-box'
import { Row, Col, When, Icon, Box } from '@z1/lib-ui-box-elements'

// main
const renderIconLabel = z.fn(t => props => {
  const icon = t.pathOr(null, ['icon'], props)
  const caption = t.pathOr(null, ['caption'], props)
  const label = t.pathOr(null, ['label'], props)
  const children = t.pathOr(null, ['children'], props)
  const hasIcon = t.not(t.isNil(icon))
  const hasCaption = t.not(t.isNil(caption))
  const hasLabel = t.not(t.isNil(label))
  const hasChildren = t.not(t.isNil(children))
  const nextProps = t.omit(['icon', 'caption', 'label', 'children'], props)
  return (
    <Row x="left" y="center" display="inline-flex" alignSelf="auto" {...nextProps}>
      <When
        is={t.or(hasIcon, hasCaption)}
        render={() => {
          return (
            <Col x="center" y="center">
              <When is={hasIcon} render={() => <Icon {...icon} />} />
              <When
                is={hasCaption}
                render={() => (
                  <Row
                    x="center"
                    y="top"
                    display="inline-flex"
                    alignSelf="auto"
                    {...caption}
                  />
                )}
              />
            </Col>
          )
        }}
      />
      <When
        is={t.or(hasLabel, hasChildren)}
        render={() => {
          return (
            <Col x="left" y="center">
              <When
                is={hasLabel}
                render={() => (
                  <Row
                    x="left"
                    y="center"
                    display="inline-flex"
                    alignSelf="auto"
                    {...label}
                  />
                )}
              />
              <When is={hasChildren} render={() => children} />
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
