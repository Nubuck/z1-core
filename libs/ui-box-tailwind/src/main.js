import { task } from '@z1/preset-task'

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

const skipNull = task(t => (v, nextV) => (t.isType(v, 'Null') ? '' : nextV))
const sides = ['top', 'right', 'bottom', 'left']
const cssProps = task(t => ({
  // layout
  container: v => (t.not(v) ? '' : 'container'),
  display: v => skipNull(v, `${v}`),
  clearfix: v => (t.not(v) ? '' : 'clearfix'),
  float: v => skipNull(v, `float-${v}`),
  objectFit: v => skipNull(v, `object-${v}`),
  objectPosition: v => skipNull(v, `object-${v}`),
  overflow: v => skipNull(v, `overflow-${v}`),
  overflowX: v => skipNull(v, `overflow-x-${v}`),
  overflowY: v => skipNull(v, `overflow-y-${v}`),
  scrolling: v => skipNull(v, `scrolling-${v}`),
  position: v => skipNull(v, `${v}`),
  inset: v => skipNull(v, `inset-${v}`),
  insetX: v => skipNull(v, `inset-x-${v}`),
  insetY: v => skipNull(v, `inset-y-${v}`),
  pin(v) {
    if (t.isType(v, 'Null')) {
      return ''
    }
    return t.tags.oneLineInlineLists`
    ${t.map(([key, value]) => {
      return `${key}-${t.not(value) ? '0' : 'auto'}`
    }, t.toPairs(v))}
    `
  },
  visible: v => skipNull(v, t.not(v) ? 'invisible' : 'visible'),
  zIndex: v => skipNull(v, `z-${v}`),
  // borders
  borderColor: v => skipNull(v, `border-${v}`),
  borderStyle: v => skipNull(v, `border-${v}`),
  borderWidth(v) {
    if (t.isType(v, 'Null')) {
      return ''
    }
    if (t.isType(v, 'Boolean')) {
      return t.not(v) ? '' : 'border'
    }
    if (t.isType(v, 'Number')) {
      return `border-${v}`
    }
    if (t.isType(v, 'String')) {
      return `border-${t.head(v)}`
    }
    if (t.isType(v, 'Object')) {
      return t.tags.oneLineInlineLists`
      ${t.map(([key, value]) => {
        return `border-${t.head(key)}-${value}`
      }, t.toPairs(v))}
      `
    }
    return ''
  },
  borderRadius(v) {
    if (t.isType(v, 'Null')) {
      return ''
    }
    if (t.isType(v, 'Boolean')) {
      return t.not(v) ? '' : 'rounded'
    }
    if (t.isType(v, 'String')) {
      return `rounded-${t.contains(v, sides) ? t.head(v) : v}`
    }
    if (t.isType(v, 'Object')) {
      return t.tags.oneLineInlineLists`
      ${t.map(([key, value]) => {
        const keys = t.reduce(
          (state, nextValue) => {
            return `${state}${t.head(nextValue)}`
          },
          '',
          t.split('_', t.caseTo.paramCase(key))
        )
        return `rounded-${keys}-${value}`
      }, t.toPairs(v))}
      `
    }
    return ''
  },
  // sizing
  width: v => skipNull(v, `w-${v}`),
  minWidth: v => skipNull(v, `min-w-${v}`),
  maxWidth: v => skipNull(v, `max-w-${v}`),
  height: v => skipNull(v, `h-${v}`),
  minHeight: v => skipNull(v, `min-h-${v}`),
  maxHeight: v => skipNull(v, `max-h-${v}`),
  // typography
  color: v => skipNull(v, `text-${v}`),
  fontFamily: v => skipNull(v, `font-${v}`),
  fontSize: v => skipNull(v, `text-${v}`),
  fontSmoothing(v) {
    if (t.isType(v, 'Null')) {
      return ''
    }
    if (t.isType(v, 'Boolean')) {
      return t.not(v) ? '' : 'antialiased'
    }
    return `${v}-antialiased`
  },
  fontStyle: v => skipNull(v, t.eq(v, 'normal') ? 'non-italic' : v),
  fontWeight: v => skipNull(v, `font-${v}`),
  letterSpacing: v => skipNull(v, `tracking-${v}`),
  lineHeight: v => skipNull(v, `leading-${v}`),
  listType: v => skipNull(v, `list-${v}`),
  listPosition: v => skipNull(v, `list-${v}`),
  textAlignX: v => skipNull(v, `text-${v}`),
  textAlignY: v => skipNull(v, `align-${v}`),
  textDecoration: v => skipNull(v, t.eq(v, 'none') ? 'no-underline' : v),
  textTransform: v => skipNull(v, t.eq(v, 'normal') ? 'normal-case' : v),
  whitespace: v => skipNull(v, `whitespace-${v}`),
  wordBreak: v => skipNull(v, t.eq(v, 'truncate') ? v : `break-${v}`),
  // flexbox
  flex: v => skipNull(v, `flex-${v}`),
  flexDirection: v => skipNull(v, `flex-${v}`),
  flexWrap: v => skipNull(v, `flex-${v}`),
  alignItems: v => skipNull(v, `items-${v}`),
  alignContent: v => skipNull(v, `content-${v}`),
  alignSelf: v => skipNull(v, `self-${v}`),
  justifyContent: v => skipNull(v, `justify-${v}`),
  flexGrow: v => skipNull(v, t.not(v) ? 'flex-grow-0' : 'flex-grow'),
  flexShrink: v => skipNull(v, t.not(v) ? 'flex-shrink-0' : 'flex-shrink'),
  flexOrder: v => skipNull(v, `order-${v}`),
  // tables
  tableCollapse: v => skipNull(v, `border-${v}`),
  tableLayout: v => skipNull(v, `table-${v}`),
  // backgrounds
  bgAttachment: v => skipNull(v, `bg-${v}`),
  bgColor: v => skipNull(v, `bg-${v}`),
  bgPosition: v => skipNull(v, `bg-${v}`),
  bgRepeat: v => skipNull(v, `bg-${v}`),
  bgSize: v => skipNull(v, `bg-${v}`),
  // spacing
  padding(v) {
    if (t.isType(v, 'Null')) {
      return ''
    }
    if (t.isType(v, 'Object')) {
      return t.tags.oneLineInlineLists`
      ${t.map(([key, value]) => {
        return `p${t.head(key)}-${value}`
      }, t.toPairs(v))}
      `
    }
    return `p-${v}`
  },
  margin(v) {
    if (t.isType(v, 'Null')) {
      return ''
    }
    if (t.isType(v, 'Object')) {
      return t.tags.oneLineInlineLists`
      ${t.map(([key, value]) => {
        if (t.isType(value, 'String')) {
          return t.eq(t.head(value), '-')
            ? `-m${t.head(key)}${value}`
            : `m${t.head(key)}-${value}`
        }
        return `m${t.head(key)}-${value}`
      }, t.toPairs(v))}
      `
    }
    return `m-${v}`
  },
  // interactivity
  appearance: v => skipNull(v, `appearance-${v}`),
  cursor: v => skipNull(v, `cursor-${v}`),
  outline: v => skipNull(v, `outline-${v}`),
  pointerEvents: v => skipNull(v, `pointer-events-${v}`),
  resize(v) {
    if (t.isType(v, 'Null')) {
      return ''
    }
    if (t.isType(v, 'Boolean')) {
      return t.not(v) ? '' : 'resize'
    }
    return `resize-${v}`
  },
  userSelect: v => skipNull(v, `select-${v}`),
  // misc
  shadow(v) {
    if (t.isType(v, 'Null')) {
      return ''
    }
    if (t.isType(v, 'Boolean')) {
      return t.not(v) ? '' : 'shadow'
    }
    return `shadow-${v}`
  },
  opacity: v => skipNull(v, `opacity-${v}`),
  fill: v => skipNull(v, t.not(v) ? '' : 'fill-current'),
  stroke: v => skipNull(v, t.not(v) ? '' : 'stroke-current'),
}))

export const toCss = task(t => props => {
  const keys = t.keys(props)
  return t.tags.oneLineInlineLists`
  ${t.map(key => {
    const cssProp = cssProps[key]
    const value = props[key]
    if (t.not(isResponsive(value))) {
      return cssProp(value)
    }
    const [all, responsive] = value
    const responsiveKeys = t.keys(responsive)
    return t.tags.oneLineInlineLists`
    ${t.flatten([
      [cssProp(all)],
      t.map(
        sizeKey => `${sizeKey}:${cssProp(responsive[sizeKey])}`,
        responsiveKeys
      ),
    ])}
    `
  }, keys)}`
})

export const uiBox = task(t => (props = {}) => {
  return {
    next(nextProps = {}) {
      return uiBox(t.deepMergeRight(props, nextProps))
    },
    toBox() {
      return props
    },
    toCss() {
      return toCss(props)
    },
  }
})
