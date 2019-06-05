import { task } from '@z1/preset-task'

// tasks
const rejoin = task(t => list =>
  t.reduce(
    (state, next) => {
      return t.isZeroLen(state) ? next : `${state}-${next}`
    },
    '',
    list
  )
)
const rejoinFiltered = task(t => (key, list) =>
  t.isType(key, 'Array')
    ? rejoin(t.filter(prop => t.not(t.contains(prop, key)), list))
    : rejoin(t.filter(prop => t.not(t.eq(key, prop)), list))
)

const macroBoolProp = task(t => ({ base, mod }) => {
  if (t.and(t.isZeroLen(base), t.isZeroLen(mod))) {
    return null
  }
  if (t.isZeroLen(mod)) {
    return true
  }
  return [
    t.isZeroLen(base) ? null : true,
    t.mergeAll(
      t.map(item => {
        return { [item.prefix]: true }
      }, mod)
    ),
  ]
})
const macroCssProp = task(t => ({ base, mod }) => {
  if (t.and(t.isZeroLen(base), t.isZeroLen(mod))) {
    return null
  }
  if (t.isZeroLen(mod)) {
    return t.pathOr(null, ['css'], t.head(base))
  }
  return [
    t.isZeroLen(base) ? null : t.pathOr(null, ['css'], t.head(base)),
    t.mergeAll(
      t.map(item => {
        return { [item.prefix]: t.pathOr(null, ['css'], item) }
      }, mod)
    ),
  ]
})
const macroFilteredKeyProp = task(t => (propKey, { base, mod }) => {
  if (t.and(t.isZeroLen(base), t.isZeroLen(mod))) {
    return null
  }
  if (t.isZeroLen(mod)) {
    return rejoinFiltered(propKey, t.pathOr([], ['chunks'], t.head(base)))
  }
  return [
    t.isZeroLen(base)
      ? null
      : rejoinFiltered(propKey, t.pathOr([], ['chunks'], t.head(base))),
    t.mergeAll(
      t.map(item => {
        return {
          [item.prefix]: rejoinFiltered(
            propKey,
            t.pathOr([], ['chunks'], item)
          ),
        }
      }, mod)
    ),
  ]
})
const macroObjectFilteredKeyProp = task(
  t => (propKey, match, { base, mod }) => {
    if (t.and(t.isZeroLen(base), t.isZeroLen(mod))) {
      return null
    }
    const mergeProps = propList => {
      if (t.eq(t.length(propList), 1)) {
        const propHead = t.head(base)
        if (t.eq(t.length(propHead.chunks), 1)) {
          return true
        }
      }
      return t.mergeAll(
        t.map(prop => {
          return {
            [t.getMatch(prop.match)(match)]: rejoinFiltered(
              propKey,
              t.pathOr([], ['chunks'], prop)
            ),
          }
        }, propList)
      )
    }
    if (t.isZeroLen(mod)) {
      return mergeProps(base)
    }
    return [
      t.isZeroLen(base) ? null : mergeProps(base),
      t.mapObjIndexed(
        value => mergeProps(value),
        t.groupBy(item => item.prefix, mod)
      ),
    ]
  }
)

// main
export const boxProps = task(t => ({
  container(props) {
    return macroBoolProp(props)
  },
  display(props) {
    return macroCssProp(props)
  },
  clearfix(props) {
    return macroBoolProp(props)
  },
  float(props) {
    return macroFilteredKeyProp('float', props)
  },
  objectFit(props) {
    return macroFilteredKeyProp('object', props)
  },
  objectPosition(props) {
    return macroFilteredKeyProp('object', props)
  },
  overflow(props) {
    return macroFilteredKeyProp('overflow', props)
  },
  overflowX(props) {
    return macroFilteredKeyProp(['overflow', 'x'], props)
  },
  overflowY(props) {
    return macroFilteredKeyProp(['overflow', 'y'], props)
  },
  scrolling(props) {
    return macroFilteredKeyProp('scrolling', props)
  },
  position(props) {
    return macroCssProp(props)
  },
  inset(props) {
    return macroFilteredKeyProp('inset', props)
  },
  insetX(props) {
    return macroFilteredKeyProp(['inset', 'x'], props)
  },
  insetY(props) {
    return macroFilteredKeyProp(['inset', 'y'], props)
  },
  pin({ base, mod }) {
    if (t.and(t.isZeroLen(base), t.isZeroLen(mod))) {
      return null
    }
    const mergeProps = propList =>
      t.mergeAll(
        t.map(prop => {
          return { [prop.key]: t.not(t.contains('auto', prop.chunks)) }
        }, propList)
      )
    if (t.isZeroLen(mod)) {
      return mergeProps(base)
    }
    return [
      t.isZeroLen(base) ? null : mergeProps(base),
      t.mapObjIndexed(
        value => mergeProps(value),
        t.groupBy(item => item.prefix, mod)
      ),
    ]
  },
  visible(props) {
    return macroCssProp(props)
  },
  zIndex(props) {
    return macroFilteredKeyProp('z', props)
  },
  borderColor(props) {
    return macroFilteredKeyProp('border', props)
  },
  borderStyle(props) {
    return macroFilteredKeyProp('border', props)
  },
  borderWidth(props) {
    return macroObjectFilteredKeyProp(
      ['border', 't', 'r', 'b', 'l'],
      {
        t: 'top',
        r: 'right',
        b: 'bottom',
        l: 'left',
      },
      props
    )
  },
  borderRadius(props) {
    return macroObjectFilteredKeyProp(
      ['rounded', 't', 'r', 'b', 'l', 'tl', 'tr', 'bl', 'br'],
      {
        t: 'top',
        r: 'right',
        b: 'bottom',
        l: 'left',
        tl: 'topLeft',
        tr: 'topRight',
        bl: 'bottomLeft',
        br: 'bottomRight',
      },
      props
    )
  },
  width(props) {
    return macroFilteredKeyProp('w', props)
  },
  minWidth(props) {
    return macroFilteredKeyProp(['min', 'w'], props)
  },
  maxWidth(props) {
    return macroFilteredKeyProp(['max', 'w'], props)
  },
  height(props) {
    return macroFilteredKeyProp('h', props)
  },
  minHeight(props) {
    return macroFilteredKeyProp(['min', 'h'], props)
  },
  maxHeight(props) {
    return macroFilteredKeyProp(['max', 'h'], props)
  },
  color(props) {
    return macroFilteredKeyProp('text', props)
  },
  fontFamily(props) {
    return macroFilteredKeyProp('font', props)
  },
  fontSize(props) {
    return macroFilteredKeyProp('text', props)
  },
  fontSmoothing(props) {
    return macroCssProp(props)
  },
  fontStyle(props) {
    return macroCssProp(props)
  },
  fontWeight(props) {
    return macroFilteredKeyProp('font', props)
  },
  letterSpacing(props) {
    return macroFilteredKeyProp('tracking', props)
  },
  lineHeight(props) {
    return macroFilteredKeyProp('leading', props)
  },
  listType(props) {
    return macroFilteredKeyProp('list', props)
  },
  listPosition(props) {
    return macroFilteredKeyProp('list', props)
  },
  textAlignX(props) {
    return macroFilteredKeyProp('list', props)
  },
  textAlignY(props) {
    return macroFilteredKeyProp('align', props)
  },
  textDecoration(props) {
    return macroCssProp(props)
  },
  textTransform(props) {
    return macroCssProp(props)
  },
  whitespace(props) {
    return macroFilteredKeyProp('whitespace', props)
  },
  wordBreak(props) {
    return macroFilteredKeyProp('break', props)
  },
  flex(props) {
    return macroFilteredKeyProp('flex', props)
  },
  flexDirection(props) {
    return macroFilteredKeyProp('flex', props)
  },
  flexWrap(props) {
    return macroFilteredKeyProp('flex', props)
  },
  alignItems(props) {
    return macroFilteredKeyProp('items', props)
  },
  alignContent(props) {
    return macroFilteredKeyProp('content', props)
  },
  alignSelf(props) {
    return macroFilteredKeyProp('self', props)
  },
  justifyContent(props) {
    return macroFilteredKeyProp('justify', props)
  },
  flexGrow(props) {
    return macroFilteredKeyProp('flex', props)
  },
  flexShrink(props) {
    return macroFilteredKeyProp('flex', props)
  },
  flexOrder(props) {
    return macroFilteredKeyProp('order', props)
  },
  tableCollapse(props) {
    return macroFilteredKeyProp('table', props)
  },
  tableLayout(props) {
    return macroFilteredKeyProp('table', props)
  },
  bgAttachment(props) {
    return macroFilteredKeyProp('bg', props)
  },
  bgColor(props) {
    return macroFilteredKeyProp('bg', props)
  },
  bgPosition(props) {
    return macroFilteredKeyProp('bg', props)
  },
  bgRepeat(props) {
    return macroFilteredKeyProp('bg', props)
  },
  bgSize(props) {
    return macroFilteredKeyProp('bg', props)
  },
  padding(props) {
    return null
  },
  margin(props) {
    return null
  },
  appearance(props) {
    return null
  },
  cursor(props) {
    return null
  },
  outline(props) {
    return null
  },
  pointerEvents(props) {
    return null
  },
  resize(props) {
    return null
  },
  userSelect(props) {
    return null
  },
  shadow(props) {
    return null
  },
  opacity(props) {
    return null
  },
  fill(props) {
    return null
  },
  stroke(props) {
    return null
  },
}))
