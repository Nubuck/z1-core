import React from 'react'
import { fn } from '@z1/lib-ui-box'

// elements
import { renderBox } from './Box'

// main
const renderIcon = fn(t => props => {
  const el = t.pathOr('i', ['as'], props)
  const prefix = t.pathOr('la', ['prefix'], props)
  const iconPrefix = t.pathOr('la', ['iconPrefix'], props)
  const icon = t.pathOr('', ['name'], props)
  const fontSize = t.pathOr(null, ['size'], props)
  const className = t.pathOr(null, ['className'], props)
  return renderBox(
    t.merge(
      t.omit(
        ['as', 'prefix', 'iconPrefix', 'className', 'name', 'size', 'box'],
        props
      ),
      {
        as: el,
        className: `${prefix} ${iconPrefix}-${icon}${
          t.isNil(className) ? '' : ` ${className}`
        }`,
        box: t.merge(
          {
            fontSize,
          },
          t.pathOr({}, ['box'], props)
        ),
      }
    )
  )
})

export class Icon extends React.Component {
  render() {
    return renderIcon(this.props)
  }
}
Icon.displayName = 'Icon'
