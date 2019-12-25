import React from 'react'
import { task } from '@z1/preset-task'

// elements
import { Box } from './Box'

// main
const renderTextArea = task(t => props => {
  const as = t.pathOr('textarea', ['as'], props)
  const className = t.pathOr(null, ['className'], props)
  return React.createElement(
    Box,
    t.merge(t.omit(['as', 'className', 'box'], props), {
      as,
      className: `form-textarea${t.isNil(className) ? '' : ` ${className}`}`,
      box: t.merge(
        {
          display: 'block',
          width: 'full',
        },
        t.pathOr({}, ['box'], props)
      ),
    })
  )
})

export class TextArea extends React.Component {
  render() {
    return renderTextArea(this.props)
  }
}
