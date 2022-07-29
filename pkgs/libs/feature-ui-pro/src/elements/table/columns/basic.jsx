import z from '@z1/lib-feature-box'

// parts
import { headerRenderer } from './headerRenderer'
import { cellRenderer } from './cellRenderer'

// main
export const basic = z.fn((t) => (props) => {
  return t.mergeDeepRight(props, {
    headerRenderer,
    cellRenderer,
  })
})
