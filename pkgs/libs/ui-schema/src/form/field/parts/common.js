import fn from '@z1/preset-task'

// main
export const renderChildren = fn(t => (ctx, parent, children) => {
  return t.reduce((cx, ff) => ff(cx, parent), ctx, children || [])
})

export const isFixedItemList = fn(t => (children, additional) => {
  return t.allOf([
    t.gte(t.isType(children, 'array') ? t.len(children) : 0, 1),
    t.or(t.isType(additional, 'object'), t.isType(additional, 'array')),
  ])
})
