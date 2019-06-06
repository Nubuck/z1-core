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
export const toBox = task(t => (css = '') => {
  if (t.isZeroLen(css)) {
    return {}
  }
  return t.mapObjIndexed(
    (val, key) => {
      const boxProp = boxProps[key]
      if (t.not(boxProp)) {
        return t.tags.oneLineInlineLists`${t.map(item => item.css, val || [])}`
      }
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
        const def = defs[keyChunk] || { key: className, map: 'className' }
        const nextDef = t.isType(def.map, 'Array')
          ? t.find(item => t.eq(item.key, matchChunk), def.map)
          : def
        const propDef = t.not(nextDef)
          ? t.find(item => t.eq(item.key, keyChunk), def.map)
          : nextDef
        return t.mergeAll([
          base,
          {
            key: keyChunk,
            match: matchChunk,
            chunks: defChunks,
          },
          propDef,
        ])
      }, t.split(' ', css))
    )
  )
})
