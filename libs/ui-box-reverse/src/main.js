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

  //   if (t.gt(t.length(forkProps.base), 1)){
  //       const leadProp = t.head()
  //   }

  return forkProps

  //   let nextProp = null
  //   if (t.not(t.isZeroLen(forkProps.base))) {
  //     if (t.gt(t.length(forkProps.base), 1)) {
  //       nextProp = t.mergeAll(
  //         t.map(prop => {
  //           return { [prop.alias]: rejoin(t.tail(prop.chunks)) }
  //         }, forkProps.base)
  //       )
  //     } else {
  //       const leadProp = t.head(forkProps.base)
  //       nextProp = leadProp.css
  //     }
  //   }
  //   return {
  //     [key]: t.isZeroLen(forkProps.prefix)
  //       ? nextProp
  //       : [nextProp, forkProps.prefix],
  //   }
})
export const cssToBox = task(t => (css = '') => {
  const output = t.mergeAll(
    t.map(
      ([key, value]) => computePropList(key, value),
      t.toPairs(
        t.groupBy(
          out => out.map,
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
            const nextDef = t.eq(def.type, 'fork')
              ? t.find(
                  item =>
                    t.or(t.eq(item.key, keyChunk), t.eq(item.key, matchChunk)),
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
        )
      )
    )
  )
  //   console.log('OUTPUT:', output)

  return output
})

// test

// export const stub =
//   'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
export const stub =
  'container inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2'
// export const stub =
//   'h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden'
// export const stub =
//   'flex flex-col w-5/6 lg:w-1/4 mx-auto lg:mx-0 rounded-none lg:rounded-l-lg bg-white mt-4'
// export const stub =
//   'flex flex-col w-5/6 lg:w-1/3 mx-auto lg:mx-0 rounded-lg bg-white mt-4 sm:-mt-6 shadow-lg z-10'
