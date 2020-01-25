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
} from '@z1/lib-ui-box-elements'

// main
const renderListItem = z.fn(t => props => {
  // status:
  // loading
  // disabled
  // selected

  // actions: to, onClick, onSelect

  // cols: select, avatar, title, content, last

  // select col:
  // select
  // -> icon: on / of

  // avatar col:
  // avatar
  // caption
  // -> text

  // title col:
  // title
  // -> text
  // subtitle
  // -> icon, label

  // content col:
  // children

  // last col:
  // stamp
  // -> icon, label
  // buttons[]
  // -> button

  // colors: on / off / selected
  const nextProps = t.omit(
    [
      'loading',
      'disabled',
      'selected',
      'to',
      'onClick',
      'onSelect',
      'cols',
      'avatar',
      'select',
      'caption',
      'title',
      'subtitle',
      'children',
      'content',
      'stamp',
      'buttons',
      'colors',
      'color',
      'nested',
    ],
    props
  )
  return null
})

export class ListItem extends React.Component {
  render() {
    return renderListItem(this.props)
  }
}
ListItem.displayName = 'ListItem'
