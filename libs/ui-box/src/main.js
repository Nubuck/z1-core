import { task } from '@z1/preset-task'

// parts
import { toCss } from './toCss'

// main
export const uiBox = task(t => (props = {}) => {
  return {
    next(nextProps = {}) {
      return t.isType(nextProps, 'Function')
        ? nextProps(uiBox(props))
        : uiBox(t.mergeDeepRight(props, nextProps))
    },
    toBox() {
      return props
    },
    toCss() {
      return toCss(props)
    },
  }
})

