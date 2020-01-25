import fn from '@z1/preset-task'

// main
export const renderChildren = fn(t => (ctx, parent, parentPath, children) => {
  return t.reduce((cx, ff) => ff(cx, parent, parentPath), ctx, children || [])
})

export const findNavItem = fn(t =>
  t.trampoline(function search(unsafePath, schema = {}) {
    const safePath = t.eq(t.last(unsafePath), '/')
      ? t.dropLast(1, unsafePath)
      : unsafePath
    const path = t.startsWith('/', safePath) ? safePath : `/${safePath}`
    const schemaKeys = t.keys(schema)
    if (t.isZeroLen(schemaKeys)) {
      return null
    }
    const pathKey = t.to.snakeCase(path)
    if (t.eq(t.len(schemaKeys), 1)) {
      const singleKey = t.head(schemaKeys)
      const singleItem = t.path([singleKey], schema)
      if (t.eq(pathKey, singleKey)) {
        return singleItem
      }
      return singleItem.hasChildren
        ? () => search(path, singleItem.children)
        : null
    }
    const item = t.path([pathKey], schema)
    if (t.notNil(item)) {
      return item
    }
    const nextSchema = t.mergeAll(
      t.map(
        ([_, props]) => props.children,
        t.filter(([_, props]) => props.hasChildren, t.to.pairs(schema))
      )
    )
    return () => search(path, nextSchema)
  })
)
