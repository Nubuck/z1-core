import React from 'react'
import z from '@z1/lib-feature-box'
import {
  Row,
  Col,
  When,
  Icon,
  Box,
  Button,
  Avatar,
  MapIndexed,
} from '@z1/lib-ui-box-elements'

// main
const renderListItem = z.fn(t => props => {
  // mode:
  const selectable = t.pathOr(false, ['selectable'], props)
  // status:
  const loading = t.pathOr(false, ['loading'], props)
  const disabled = t.pathOr(false, ['disabled'], props)
  const selected = t.pathOr(false, ['selected'], props)
  // actions:
  const to = t.pathOr(null, ['to'], props)
  const onClick = t.pathOr(null, ['onClick'], props)
  const onSelect = t.pathOr(null, ['onSelect'], props)
  // layout:
  const cols = t.pathOr({}, ['cols'], props)
  const colSelect = t.pathOr(null, ['select'], cols)
  const colAvatar = t.pathOr(null, ['avatar'], cols)
  const colTitle = t.pathOr(null, ['title'], cols)
  const colContent = t.pathOr(null, ['content'], cols)
  const colLast = t.pathOr(null, ['last'], cols)
  const hasCols = t.anyOf([colSelect, colAvatar, colTitle, colContent, colLast])
  // select col:
  const select = t.pathOr(null, ['select'], props)
  // avatar col:
  const avatar = t.pathOr(null, ['avatar'], props)
  const caption = t.pathOr(null, ['caption'], props)
  // title col:
  const title = t.pathOr(null, ['title'], props)
  const subtitle = t.pathOr(null, ['subtitle'], props)
  // content col:
  const content = t.pathOr(null, ['content'], props)
  // last col:
  const stamp = t.pathOr(null, ['stamp'], props)
  const buttons = t.pathOr(null, ['buttons'], props)
  // nested
  const nested = t.pathOr(null, ['nested'], props)
  const children = t.pathOr(null, ['children'], props)
  // colors: on / off / selected
  const colors = t.pathOr(null, ['colors'], props)
  const color = t.pathOr(null, ['color'], props)
  const nextProps = t.omit(
    [
      'selectable',
      'loading',
      'disabled',
      'selected',
      'to',
      'onClick',
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
      'colors',
      'color',
    ],
    props
  )
  return (
    <Col {...nextProps}>
      <Row key="row-main">
        <Col key="col-select">
          <Button key="selector" />
        </Col>
        <Col key="col-avatar">
          <Row x="center" y="center" key="row-avatar">
            <Avatar key="avatar" />
          </Row>
          <Row key="caption" />
        </Col>
        <Col key="col-title">
          <Row key="title" />
          <Row key="subtitle" />
        </Col>
        <Col key="col-content">
          <Row key="content" />
        </Col>
        <Col key="col-last">
          <Row key="stamp" />
          <Row key="buttons">
            <MapIndexed
              items={[]}
              render={(button, index) => (
                <Button key={`li-btn-${index}`} {...buttonx} />
              )}
            />
          </Row>
        </Col>
      </Row>
      <Row key="row-nested">
        <Col key="col-nested"></Col>
      </Row>
    </Col>
  )
})

export class ListItem extends React.Component {
  render() {
    return renderListItem(this.props)
  }
}
ListItem.displayName = 'ListItem'
