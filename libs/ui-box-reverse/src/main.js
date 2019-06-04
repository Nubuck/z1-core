import { task } from '@z1/preset-task'
import { defs, cssPropTypes } from './defs'

// main
const rejoin = task(t => list =>
  t.reduce(
    (state, next) => {
      return t.isZeroLen(state) ? next : `${state}-${next}`
    },
    '',
    list
  )
)
const computePropList = task(t => (key = '_', list = []) => {
  const forkProps = t.reduce(
    (state, prop) => {
      return t.merge(state, {
        prefix: t.not(prop.prefix)
          ? state.prefix
          : t.concat(state.prefix, [prop]),
        base: prop.prefix ? state.base : t.concat(state.base, [prop]),
      })
    },
    {
      prefix: [],
      base: [],
    },
    list
  )

  //   console.log('OUTPUT: ', key, forkProps)
  let nextProp = null
  if (t.not(t.isZeroLen(forkProps.base))) {
    const leadProp = t.head(forkProps.base)
    console.log('LEAD PROP', key, leadProp)
    const canBeObject = t.eq(t.type(leadProp.propType), 'Array')
      ? t.contains('Object', leadProp.propType)
      : t.eq(leadProp.propType, 'Object')
    // console.log('CAN BE OBJECT', key, canBeObject)
    if (canBeObject) {
      nextProp = t.mergeAll(
        t.map(prop => {
          console.log('OBJ PROP', prop)
          return { [prop.alias || prop.key]: null }
        }, forkProps.base)
      )
    }
  }

  return forkProps
})
export const cssToBox = task(t => (css = '') => {
  if (t.isZeroLen(css)) {
    return {}
  }
  const output =
    // t.mergeAll(
    //   t.map(
    //     ([key, value]) => computePropList(key, value),
    //     t.toPairs(
    //       t.groupBy(
    //         out => out.map,
    t.map(className => {
      const prefixList = t.split(':', className)
      const base = t.gt(t.length(prefixList), 1)
        ? {
            css: t.head(t.tail(prefixList)),
            prefix: t.head(prefixList),
          }
        : {
            css: t.head(prefixList),
            prefix: null,
          }
      const defChunks = t.split('-', base.css)
      const keyChunk = t.head(defChunks)
      const matchChunk = t.gt(t.length(defChunks), 1)
        ? t.head(t.tail(defChunks))
        : null
      const def = defs[keyChunk]
      const nextDef = t.isType(def.map, 'Array')
        ? t.find(
            item => t.or(t.eq(item.key, keyChunk), t.eq(item.key, matchChunk)),
            def.map
          )
        : def
      const propType = cssPropTypes[nextDef.map]
      return t.mergeAll([
        base,
        {
          key: keyChunk,
          match: matchChunk,
          chunks: defChunks,
          propType,
        },
        nextDef,
      ])
    }, t.split(' ', css))
  // )
  // )
  // )
  // )
  // console.log('OUTPUT:', output)

  const groupOutput = t.groupBy(
    prop => prop.map,
    output
  )
  console.log('GROUPED OUTPUT:', groupOutput)

  

  return output
})

// test
export const box = {
  container: true,
  borderRadius: [
    {
      top: 'sm',
      bottomLeft: 'md',
    },
    { sm: { top: 'none', bottom: 'sm' } },
  ],
}
export const stub =
  'container rounded-t-sm rounded-bl-md sm:rounded-t-none sm:rounded-b-sm'
