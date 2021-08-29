import z from '@z1/lib-feature-box'

// parts
import { bytes as bx } from '../../parts'
import { headerRenderer } from './headerRenderer'
import { cellRenderer } from './cellRenderer'

// main
export const bytes = z.fn((t) => (props) => {
  return t.mergeDeepRight(props, {
    headerRenderer,
    cellRenderer: (props) => {
      return cellRenderer(
        t.merge(props, {
          cellData: t.notNil(props.cellData)
            ? bx(props.cellData)
            : '',
        })
      )
    },
  })
})
