import fn from '@z1/preset-task'

// parts
import field, { keys } from './field'

// main
export const form = fn(t => factory => {
  const formSchema = factory(field, keys)
  const safeSchema = t.isType(formSchema, 'array')
    ? t.head(formSchema)
    : formSchema
  return safeSchema({}, 'root')
})
