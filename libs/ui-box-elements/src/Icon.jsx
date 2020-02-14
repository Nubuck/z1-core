import React from 'react'
import { fn } from '@z1/lib-ui-box'

// elements
import { renderBox } from './Box'

// main
const renderIcon = fn(t => props => {
  const el = t.atOr('i', 'as', props)
  const prefix = t.atOr('la', 'prefix', props)
  const iconPrefix = t.atOr('la', 'iconPrefix', props)
  const icon = t.atOr('', 'name', props)
  const fontSize = t.atOr(null, 'size', props)
  const className = t.atOr(null, 'className', props)
  return renderBox(
    t.merge(
      t.omit(
        ['as', 'prefix', 'iconPrefix', 'className', 'name', 'size', 'box'],
        props
      ),
      {
        as: el,
        className: `z1-icon ${prefix} ${iconPrefix}-${icon}${
          t.isNil(className) ? '' : ` ${className}`
        }`,
        box: t.merge(
          {
            fontSize,
          },
          t.atOr({}, 'box', props)
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
