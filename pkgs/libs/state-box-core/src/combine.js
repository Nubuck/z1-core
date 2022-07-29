import { fn } from './fn'

// main
export const combine = fn(t => (boxes = [], combineWith = () => ({})) => {
  return t.reduce(
    (nextBoxes, box) => {
      return t.merge(
        {
          reducers: t.merge(nextBoxes.reducers, { [box.name]: box.reducer }),
          effects: t.concat(nextBoxes.effects, box.effects),
          onInit: t.isNil(box.onInit)
            ? nextBoxes.onInit
            : t.concat(nextBoxes.onInit, [box.onInit]),
          afterInit: t.isNil(box.afterInit)
            ? nextBoxes.afterInit
            : t.concat(nextBoxes.afterInit, [box.afterInit]),
        },
        combineWith(nextBoxes, box)
      )
    },
    {
      reducers: {},
      effects: [],
      onInit: [],
      afterInit: [],
    },
    boxes
  )
})
