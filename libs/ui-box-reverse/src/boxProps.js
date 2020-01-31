import { task } from '@z1/preset-task'

// tasks
const rejoin = task(t => list =>
  t.reduce(
    (state, next) => {
      return t.noLen(state) ? next : `${state}-${next}`
    },
    '',
    list
  )
)
const rejoinFiltered = task(t => (key, list) =>
  t.isType(key, 'Array')
    ? rejoin(t.filter(prop => t.not(t.includes(prop, key)), list))
    : rejoin(t.filter(prop => t.not(t.eq(key, prop)), list))
)

// macros
const macroBoolProp = task(t => ({ base, mod }) => {
  if (t.and(t.noLen(base), t.noLen(mod))) {
    return null
  }
  if (t.noLen(mod)) {
    return true
  }
  return [
    t.noLen(base) ? null : true,
    t.mergeAll(
      t.map(item => {
        return { [item.prefix]: true }
      }, mod)
    ),
  ]
})
const macroCssProp = task(
  t => ({ base, mod }, trueKey = undefined, valSwap = undefined) => {
    if (t.and(t.noLen(base), t.noLen(mod))) {
      return null
    }
    if (t.noLen(mod)) {
      const result = t.atOr(null, 'css', t.head(base))
      return t.not(t.eq(trueKey, undefined))
        ? t.eq(result, trueKey)
          ? true
          : t.replace(`-${trueKey}`, '', result)
        : t.not(t.eq(valSwap, undefined))
        ? t.eq(result, valSwap.match)
          ? valSwap.value
          : result
        : result
    }
    return [
      t.noLen(base) ? null : t.atOr(null, 'css', t.head(base)),
      t.mergeAll(
        t.map(item => {
          const result = t.atOr(null, 'css', item)
          return {
            [item.prefix]: t.not(t.eq(trueKey, undefined))
              ? t.eq(result, trueKey)
                ? true
                : t.replace(`-${trueKey}`, '', result)
              : t.not(t.eq(valSwap, undefined))
              ? t.eq(result, valSwap.match)
                ? valSwap.value
                : result
              : result,
          }
        }, mod)
      ),
    ]
  }
)
const findMatch = task(t => (result, list) => {
  const matched = t.find(item => t.eq(item.match, result), list)
  return t.not(matched) ? result : matched.value
})
const nextMacroResult = task(t => (result, swapVal) => {
  return t.not(t.eq(swapVal, undefined))
    ? t.isType(swapVal, 'Array')
      ? findMatch(result, swapVal)
      : t.eq(swapVal.match, result)
      ? swapVal.value
      : result
    : result
})
const macroFilteredKeyProp = task(
  t => (propKey, { base, mod }, swapVal = undefined) => {
    if (t.and(t.noLen(base), t.noLen(mod))) {
      return null
    }
    if (t.noLen(mod)) {
      return nextMacroResult(
        rejoinFiltered(propKey, t.atOr([], 'chunks', t.head(base))),
        swapVal
      )
    }
    const result = t.noLen(base)
      ? null
      : rejoinFiltered(propKey, t.atOr([], 'chunks', t.head(base)))
    return [
      nextMacroResult(result, swapVal),
      t.mergeAll(
        t.map(item => {
          return {
            [item.prefix]: nextMacroResult(
              rejoinFiltered(propKey, t.atOr([], 'chunks', item)),
              swapVal
            ),
          }
        }, mod)
      ),
    ]
  }
)
const macroObjectFilteredKeyProp = task(
  t => (propKey, match, { base, mod }, swapVal = undefined) => {
    if (t.and(t.noLen(base), t.noLen(mod))) {
      return null
    }
    const mergeProps = propList => {
      if (t.eq(t.length(propList), 1)) {
        const propHead = t.head(base)
        if (t.eq(t.length(propHead.chunks), 1)) {
          return true
        }
      }
      if (t.eq(t.length(propList), 1)) {
        const propHead = t.head(base)
        if (
          t.and(
            t.eq(t.length(propHead.chunks), 2),
            t.not(t.has('alias')(propHead))
          )
        ) {
          return propHead.match
        }
      }
      return t.mergeAll(
        t.map(prop => {
          const nextKey = t.not(match)
            ? t.has('alias')(prop)
              ? prop.alias
              : prop.match
            : t.match(match)(prop.match)
          return {
            [nextKey]: nextMacroResult(
              rejoinFiltered(propKey, t.atOr([], 'chunks', prop)),
              swapVal
            ),
          }
        }, propList)
      )
    }
    if (t.noLen(mod)) {
      return mergeProps(base)
    }
    return [
      t.noLen(base) ? null : mergeProps(base),
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
    if (t.and(t.noLen(base), t.noLen(mod))) {
      return null
    }
    const mergeProps = propList =>
      t.mergeAll(
        t.map(prop => {
          return { [prop.key]: t.not(t.includes('auto', prop.chunks)) }
        }, propList)
      )
    if (t.noLen(mod)) {
      return mergeProps(base)
    }
    return [
      t.noLen(base) ? null : mergeProps(base),
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
    return macroCssProp(props, 'antialiased')
  },
  fontStyle(props) {
    return macroCssProp(props, undefined, {
      match: 'non-italic',
      value: 'normal',
    })
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
    return macroCssProp(props, undefined, {
      match: 'no-underline',
      value: 'none',
    })
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
    return macroFilteredKeyProp('flex', props, [
      { match: 'wrap', value: true },
      { match: 'no-wrap', value: false },
      { match: 'wrap-reverse', value: 'reverse' },
    ])
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
    return macroFilteredKeyProp('flex', props, [
      { match: 'grow-0', value: false },
      { match: 'grow', value: true },
    ])
  },
  flexShrink(props) {
    return macroFilteredKeyProp('flex', props, [
      { match: 'shrink', value: true },
      { match: 'shrink-0', value: false },
    ])
  },
  flexOrder(props) {
    return macroFilteredKeyProp('order', props)
  },
  tableCollapse(props) {
    return macroFilteredKeyProp('table', props, [
      { match: 'collapse', value: true },
      { match: 'separate', value: false },
    ])
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
    console.log('PADDING PROPS', props)
    return macroObjectFilteredKeyProp(
      ['p', 'pt', 'pr', 'pb', 'pl', 'px', 'py'],
      undefined,
      props
    )
  },
  margin(props) {
    console.log('MARGIN PROPS', props)
    return macroObjectFilteredKeyProp(
      [
        'm',
        'mt',
        'mr',
        'mb',
        'ml',
        'mx',
        'my',
        '-m',
        '-mt',
        '-mr',
        '-mb',
        '-ml',
        '-mx',
        '-my',
      ],
      undefined,
      props
    )
  },
  appearance(props) {
    return macroFilteredKeyProp('appearance', props)
  },
  cursor(props) {
    return macroFilteredKeyProp('cursor', props)
  },
  outline(props) {
    return macroFilteredKeyProp('outline', props)
  },
  pointerEvents(props) {
    return macroFilteredKeyProp(['pointer', 'events'], props)
  },
  resize(props) {
    return macroFilteredKeyProp('resize', props, { match: '', value: true })
  },
  userSelect(props) {
    return macroFilteredKeyProp('select', props)
  },
  shadow(props) {
    return macroFilteredKeyProp('shadow', props, { match: '', value: true })
  },
  opacity(props) {
    return macroFilteredKeyProp('opacity', props)
  },
  fill(props) {
    return macroFilteredKeyProp('fill', props, {
      match: 'current',
      value: true,
    })
  },
  stroke(props) {
    return macroFilteredKeyProp('stroke', props, {
      match: 'current',
      value: true,
    })
  },
}))
