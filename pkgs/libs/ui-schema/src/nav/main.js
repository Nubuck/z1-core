import fn from '@z1/preset-task'
// parts
import { renderChildren } from './parts'
import { item } from './item'

//main
export const nav = fn(t => factory => {
  const nextSchema = factory(item)
  return t.isType(nextSchema, 'array')
    ? renderChildren({}, 'root', null, nextSchema)
    : nextSchema({}, 'root', null)
})
