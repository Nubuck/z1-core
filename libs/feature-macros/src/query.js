import { fn } from '@z1/lib-feature-box'

// main
export const query = fn(t => (name, otherKeys = []) => state => {
  const boxName = t.caseTo.camelCase(name)
  return t.merge(
    {
      brand: t.pathOr({}, ['brand'], state),
      [boxName]: t.pathOr({}, [boxName], state),
    },
    t.isZeroLen(otherKeys) ? {} : t.pick(otherKeys, state)
  )
})