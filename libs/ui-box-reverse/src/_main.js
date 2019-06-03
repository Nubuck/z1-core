import { task } from '@z1/preset-task'
import { equal } from 'assert'
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
const combineProps = task(t => (key, list) => {
  const groupProps = t.groupBy(
    item => (t.not(item.mods) ? 'base' : 'mods'),
    list
  )
  const nextVal = t.contains({ type: 'key' }, groupProps.base || [])
    ? t.reduce(
        (base, nextBase) => {
          if (t.not(nextBase.alias)) {
            return base
          }
          return t.merge(base, {
            [nextBase.alias]: nextBase.value,
          })
        },
        {},
        groupProps.base || []
      )
    : t.pathOr(null, ['value'], t.head(groupProps.base))
  if (t.not(groupProps.mods)) {
    return nextVal
  }
  const nextMods = t.reduce(
    (mods, nextMod) => {
      return t.merge(mods, {
        [nextMod.mods]: nextMod.value,
      })
    },
    {},
    groupProps.mods || []
  )
  return [nextVal, nextMods]
})

export const cssToBox = task(t => (css = '') => {
  const classNames = t.split(' ', css)
  const props = t.map(className => {
    const mods = t.split(':', className)
    const cssProp = t.gt(t.length(mods), 1)
      ? {
          css: t.head(t.tail(mods)),
          mods: t.head(mods),
        }
      : { css: t.head(mods), mods: null }
    const chunks = t.split('-', cssProp.css)
    const defKey = t.head(chunks)
    const def = defs[defKey]
    let fragment = {}
    const defVal = t.tail(chunks)
    if (t.eq(def.type, 'fork')) {
      const checkKey = t.eq(t.length(chunks), 1) ? defKey : t.head(defVal)
      const mapDef = t.find(item => t.eq(checkKey, item.key), def.map) || {}
      fragment = {
        key: mapDef.map,
        type: mapDef.type,
        value: t.isZeroLen(defVal) ? checkKey : rejoin(defVal),
        alias: mapDef.alias,
      }
    }
    if (t.or(t.eq(def.type, 'key'), t.eq(def.type, 'value'))) {
      fragment = {
        key: def.map,
        type: def.type,
        value: t.isZeroLen(defVal) ? defKey : rejoin(defVal),
        alias: def.alias,
      }
    }

    return t.merge(cssProp, fragment)
  }, classNames)
  const groupBox = t.groupBy(prop => prop.key, props)
  return t.reduce(
    (state, [key, value]) => {
      return t.merge(state, {
        [key]: combineProps(key, value),
      })
    },
    {},
    t.toPairs(groupBox) || []
  )
})

// export const stub =
//   'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
export const stub =
  'inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2'
// export const stub =
//   'h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden'