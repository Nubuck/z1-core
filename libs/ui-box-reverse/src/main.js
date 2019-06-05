import { task } from '@z1/preset-task'
import { defs } from './defs'
import { boxProps } from './boxProps'

// main
const splitProps = task(t => list =>
  t.reduce(
    (state, next) => {
      const nextKey = t.not(next.prefix) ? 'base' : 'mod'
      return t.merge(state, {
        [nextKey]: t.concat(state[nextKey], [next]),
      })
    },
    {
      base: [],
      mod: [],
    },
    list
  )
)
export const cssToBox = task(t => (css = '') => {
  if (t.isZeroLen(css)) {
    return {}
  }
  return t.mapObjIndexed(
    (val, key) => {
      const boxProp = boxProps[key]
      const nextProp = boxProp(splitProps(val))
      return nextProp
    },
    t.groupBy(
      prop => prop.map,
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
              item =>
                t.or(t.eq(item.key, keyChunk), t.eq(item.key, matchChunk)),
              def.map
            )
          : def
        return t.mergeAll([
          base,
          {
            key: keyChunk,
            match: matchChunk,
            chunks: defChunks,
          },
          nextDef,
        ])
      }, t.split(' ', css))
    )
  )
})

// test
export const box = {
  // container: true,
  // display: [
  //   'table-row',
  //   { sm: 'block', md: 'inline-block', lg: 'inline-flex', xl: 'table-cell' },
  // ],
  // clearfix: true,
  // float: ['none', { sm: 'left', md: 'right' }],
  // objectFit: 'contain',
  // objectPosition: ['left-bottom', { sm: 'bottom', md: 'right-top' }],
  // overflow: 'auto',
  // overflowX: 'hidden',
  // overflowY: 'scroll',
  // scrolling: 'touch'
  // inset: '0',
  // insetX: '0',
  // insetY: 'auto',
  pin: [
    { top: true, left: false },
    { sm: { top: true, left: false }, md: { top: true, left: false } },
  ],
  // borderRadius: [
  //   {
  //     top: 'sm',
  //     bottomLeft: 'md',
  //   },
  //   { sm: { top: 'none', bottom: 'sm' } },
  // ],
}
export const stub =
  'top-0 left-auto sm:top-0 sm:left-auto md:top-0 md:left-auto'
