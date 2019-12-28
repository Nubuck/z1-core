import { task } from '@z1/preset-task'

// parts
import { cssProps } from './cssProps'

// main
const isResponsive = task(t => value => {
  if (t.and(t.isType(value, 'Array'), t.lt(t.length(value), 2))) {
    return false
  }
  if (t.isType(value, 'Array')) {
    const [_, responsiveProps] = value
    return t.isType(responsiveProps, 'Object')
  }
  return false
})

export const toCss = task(t => props => {
  return t.tags.oneLineInlineLists`
  ${t.map(key => {
    const cssProp = cssProps[key]
    if (t.not(cssProp)) {
      return ''
    }
    const value = props[key]
    if (t.not(isResponsive(value))) {
      return cssProp(value)
    }
    const [all, responsive] = value
    const responsiveKeys = t.keys(responsive)
    return t.tags.oneLineInlineLists`
    ${t.flatten([
      [cssProp(all)],
      t.map(sizeKey => {
        const responsiveProp = cssProp(responsive[sizeKey])
        const props = t.split(' ', responsiveProp)
        return t.tags.oneLineInlineLists`${t.map(
          prop => `${sizeKey}:${prop}`,
          props
        )}`
      }, responsiveKeys),
    ])}
    `
  }, t.keys(props))}`
})