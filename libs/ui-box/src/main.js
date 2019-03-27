import { task } from '@z1/preset-task'

// tasks
export const tailHead = task(t =>
  t.compose(
    t.head,
    t.tail
  )
)
const cssProp = task(t => factory => v =>
  t.equals('auto', v) ? '' : factory(v)
)
const spacingProps = {
  size: ['xs', 'sm', 'md', 'lg'],
  side: ['x', 'y', 'top', 'right', 'bottom', 'left '],
}
const keySideOrSize = task(t => key => {
  const foundSize = t.find(size => t.equals(size, key), spacingProps.size)
  if (foundSize) {
    return 'size'
  }
  const foundSide = t.find(side => t.equals(side, key), spacingProps.side)
  if (foundSide) {
    return 'side'
  }
  return ''
})
const withSpacing = task(t => prefix => value => {
  if (t.equals(t.type(value), 'String')) {
    return `${prefix}-${value}`
  } else {
    const spacingPairs = t.toPairs(value)
    const classList = t.map(([key, val]) => {
      const keyType = keySideOrSize(key)
      if (t.equals(keyType, 'size')) {
        return `${prefix}-${val}`
      }
      if (t.equals(keyType, 'side')) {
        if (t.equals(t.type(val), 'String')) {
          return `${prefix}-${val}`
        } else {
          const sideCssList = t.map(([side, scale]) => {
            return `${prefix}${t.head(side)}-${scale}`
          })(t.toPairs(val))
          return t.tags.oneLineInlineLists`${sideCssList}`
        }
      }
      return t.tags.oneLineInlineLists`${classList}`
    }, spacingPairs)
  }
})
const withScreenSize = task(t => factory => v => {
  const nextVal =
    t.equals(t.type(v), 'Array') && t.equals(t.length(v), 1) ? t.head(v) : v
  if (t.equals(t.type(nextVal), 'String')) {
    return cssProp(factory)(nextVal)
  }
  const valueList = t.map(
    p => factory(tailHead(p), t.head(p)),
    t.toPairs(nextVal)
  )
  return t.tags.oneLineInlineLists`${valueList}`
})

// dictionary
const classNames = {
  display: withScreenSize((value, size) =>
    size && size !== 'xs' ? `d-${size}-${value}` : `d-${value}`
  ),
  flex: withScreenSize((value, size) => {
    const nextValue = value === 'col' ? 'column' : value
    return size && size !== 'xs'
      ? `flex-${size}-${nextValue}`
      : `flex-${nextValue}`
  }),
  flexItems: withScreenSize((value, size) =>
    size && size !== 'xs'
      ? `align-items-${size}-${value}`
      : `align-items-${value}`
  ),
  flexContent: withScreenSize((value, size) =>
    size && size !== 'xs'
      ? `justify-content-${size}-${value}`
      : `justify-content-${value}`
  ),
  flexGrow: cssProp(v => `flex-grow-${v}`),
  flexShrink: cssProp(v => `flex-shrink-${v}`),
  flexWrap: cssProp(v => (v ? `flex-wrap` : '')),
  position: cssProp(v => `ps-${v}`),
  width: cssProp(v => `w-${v}`),
  height: cssProp(v => `h-${v}`),
  pin: task(t => v => {
    if (t.type(v) === 'Array') {
      const nextVal = t.length(v) === 1 ? t.head(v) : v
      const nextList = t.map(p => `${p}-0`, nextVal)
      return t.tags.oneLineInlineLists`${nextList}`
    }
    return cssProp(n => `${n}-0`)(v)
  }),
  textAlign: cssProp(v => `text-${v}`),
  textSize: cssProp(v => `text-${v}`),
  textWeight: cssProp(v => `font-weight-${v}`),
  textWrap: cssProp(v => (v ? `text-wrap` : '')),
  radius: cssProp(v => `${v === 'rounded' ? v : `rounded-${v}`}`),
  padding: withSpacing('p'),
  margin: withSpacing('m'),
  className(v) {
    return v
  },
}

// ui box
const boxClassName = task(t => box => {
  const boxList = t.toPairs(box)
  const classNameList = t.filter(
    className => !t.equals(className, ''),
    t.map(prop => {
      const head = t.head(prop)
      const tail = t.tail(prop)
      return t.has(head)(classNames) ? classNames[head](tail) : ''
    }, boxList)
  )
  return t.tags.oneLineInlineLists`${classNameList}`
})
const nextBox = task(t => (box, props) => t.merge(box, props))
const boxProp = task(t => (box, prop) => t.prop(prop, box))

export const uiBox = task(t => box => {
  box = t.has('display')(box) ? box : nextBox(box, { display: 'flex' })
  return {
    next: b => uiBox(nextBox(box, b)),
    set: (prop, value) => uiBox(nextBox(box, { [prop]: value })),
    get: prop => boxProp(box, prop),
    toBox: () => box,
    toClassName: () => boxClassName(box),
  }
})

// convenience
export const boxCss = box => uiBox(box).toClassName()
