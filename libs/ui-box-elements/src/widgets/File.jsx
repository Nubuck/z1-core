import React from 'react'
import { fn } from '@z1/lib-ui-box'

// elements
import { Box } from '../Box'

// main
const renderFile = fn((t) => (props) => {
  const el = t.atOr('input', 'as', props)
  const className = t.atOr(null, 'className', props)
  return React.createElement(
    Box,
    t.merge(t.omit(['as', 'className', 'box'], props), {
      as: el,
      className: `form-input${t.isNil(className) ? '' : ` ${className}`}`,
      box: t.merge(
        {
          display: 'block',
          width: 'full',
        },
        t.atOr({}, 'box', props)
      ),
    })
  )
})

export class File extends React.Component {
  render() {
    return renderFile(this.props)
  }
}
