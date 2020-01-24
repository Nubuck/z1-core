import React from 'react'
import { fn } from '@z1/lib-ui-box'

// elements
import { renderStack } from './Stack'

// tasks
const colWidth = fn(t => width =>
  t.isNil(width) ? width : t.gte(width, 12) ? 'full' : `${width}/12`
)

// main
const renderCol = fn(t => props => {
  const sm = colWidth(t.pathOr(null, ['sm'], props))
  const md = colWidth(t.pathOr(null, ['md'], props))
  const lg = colWidth(t.pathOr(null, ['lg'], props))
  const xl = colWidth(t.pathOr(null, ['xl'], props))
  return renderStack(
    'vertical',
    t.merge(t.omit(['box', 'xs', 'sm', 'md', 'lg', 'xl'], props), {
      box: t.merge(
        {
          flex: 'none',
          width: [
            colWidth(t.pathOr(null, ['xs'], props)),
            t.mergeAll([
              t.isNil(sm) ? {} : { sm },
              t.isNil(md) ? {} : { md },
              t.isNil(lg) ? {} : { lg },
              t.isNil(xl) ? {} : { xl },
            ]),
          ],
        },
        t.pathOr({}, ['box'], props)
      ),
    })
  )
})

export class Col extends React.Component {
  render() {
    return renderCol(this.props)
  }
}
Col.displayName = 'Col'
