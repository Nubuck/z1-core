import fn from '@z1/preset-task'

// parts
import { renderChildren } from './parts'

// main
export const item = fn(t => (path = '/', options = {}, children = []) => {
  const hasChildren = t.notZeroLen(children)
  return (ctx, parent, parentPath) => {
    const nextPath = t.startsWith('~', path)
      ? `/${t.replace(/_/g, '/', parent)}/${t.replace(
          '/',
          '',
          t.replace('~', '', path)
        )}`
      : t.startsWith('/', path)
      ? path
      : `/${path}`
    const safePath = t.eq(t.last(nextPath), '/')
      ? t.dropLast(1, nextPath)
      : nextPath
    const pathKey = t.eq(safePath, '/') ? '_' : t.to.snakeCase(safePath)
    return t.merge(ctx, {
      [pathKey]: {
        path: safePath,
        parent,
        parentPath,
        hasChildren,
        children: hasChildren
          ? renderChildren({}, pathKey, safePath, children)
          : {},
        options,
      },
    })
  }
})
