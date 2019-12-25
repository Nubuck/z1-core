import React from 'react'
import { task } from '@z1/preset-task'

// elements
import { VStack } from './Stack'

// tasks
const colWidth = task(t => width =>
  t.isNil(width) ? width : t.gte(width, 12) ? 'full' : `${width}/12`
)

// main
const renderCol = task(t => props =>
  React.createElement(
    VStack,
    t.merge(t.omit(['box'], props), {
      box: t.merge(
        {
          flex: 'none',
          width: [
            colWidth(t.pathOr(null, ['xs'], props)),
            {
              sm: colWidth(t.pathOr(null, ['sm'], props)),
              md: colWidth(t.pathOr(null, ['md'], props)),
              lg: colWidth(t.pathOr(null, ['lg'], props)),
              xl: colWidth(t.pathOr(null, ['xl'], props)),
            },
          ],
        },
        t.pathOr({}, ['box'], props)
      ),
    })
  )
)

export class Col extends React.Component {
  render() {
    return renderCol(this.props)
  }
}
