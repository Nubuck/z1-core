import { fn } from './fn'

// main
const passThrough = function() {
  return {}
}
export const combine = fn(t => (boxes, reducer = undefined) => {
  const reduceBy = t.and(t.not(t.isNil(reducer)), t.isType(reducer, 'Function'))
    ? reducer
    : passThrough
  return t.reduce(
    (nextBoxes, box) => {
      return t.merge(
        {
          reducers: t.merge(nextBoxes.reducers, { [box.name]: box.reducer }),
          effects: t.concat(nextBoxes.effects, box.effects),
          onInit: t.not(box.onInit)
            ? nextBoxes.onInit
            : t.concat(nextBoxes.onInit, [box.onInit]),
        },
        reduceBy(nextBoxes, box)
      )
    },
    {
      reducers: {},
      effects: [],
      onInit: [],
    },
    boxes
  )
})
