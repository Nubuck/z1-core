import { task } from '@z1/preset-task'

// nav types
const NAV_SCHEMA = {
  PARENT: 'parent',
  ORIGIN: 'origin',
  ROOT: 'root',
  CHILDREN: 'children',
}

// nav tasks
const hasChildren = task(t => t.has(NAV_SCHEMA.CHILDREN))
const cleanRoutePath = task(t => routePath =>
  t.eq(t.last(routePath), '/') ? t.dropLast(1, routePath) : routePath
)
const cleanSuffix = task(t => suffix =>
  suffix
    ? t.eq(suffix, '/')
      ? '/'
      : t.eq(t.head(suffix), '/')
      ? cleanRoutePath(suffix)
      : `/${cleanRoutePath(suffix)}`
    : ''
)
const toUrl = task(t => (routePath, suffix) =>
  t.eq(t.head(routePath), '/')
    ? `${cleanRoutePath(routePath)}${cleanSuffix(suffix)}`
    : `/${cleanRoutePath(routePath)}${cleanSuffix(suffix)}`
)
const hasChildren = task(t => t.has(NAV_SCHEMA.CHILDREN))
const navItem = task(
  t => (path, props, children) => (parentPath, originPath) => {
    const nextOriginPath = originPath || NAV_SCHEMA.ROOT
    const nextParentPath = parentPath || NAV_SCHEMA.ROOT
    // mutable item
    let item = {
      originPath: nextOriginPath,
      parentPath: nextParentPath,
      path: undefined,
    }
    // path
    if (t.type(path) === 'Array') {
      let nextPath = ''
      t.forEach(element => {
        nextPath = `${nextPath}/${element}`
      }, path)
      item = t.merge(item, { path: nextPath })
    } else {
      item = t.merge(item, {
        path: t.not(t.eq(path, '')) ? toUrl(path) : originPath,
      })
    }
    // children
    if (t.and(children, t.gt(t.length(children), 0))) {
      const nextChildren = t.map(
        child => child(item.path, parentPath),
        children
      )
      item = t.merge(item, { children: nextChildren })
    }
    // yield mutable item with props
    return t.merge(item, props || {})
  }
)

// exports schema
export const navSchema = task(t => (factory = () => {}) =>
  t.map(
    item => item(NAV_SCHEMA.ROOT, NAV_SCHEMA.ROOT),
    factory(navItem, NAV_SCHEMA)
  )
)

// matching tasks
const hasChildren = task(t => t.has('children'))
const safeChildren = task(t => item =>
  t.and(t.not(t.isNil(item)), hasChildren(item)) ? item.children : []
)
const matchesPath = task(t => (path, item) => {
  return t.not(item)
    ? false
    : t.eq(path, '/')
    ? t.eq(item.path, path)
    : t.contains(decodeURI(path), item.path)
})
const itemByPath = task(t => (path, list) =>
  t.find(item => matchesPath(path, item), list)
)
const tailItems = task(t => (items, children) =>
  t.concat(t.tail(items), children)
)

// main
export const matchedNavItem = task(t =>
  t.trampoline(function search(path, list) {
    // list empty
    if (t.isZeroLen(list)) {
      return undefined
    }
    // list has single item
    if (t.eq(t.length(list), 1)) {
      // match head
      const singleItem = t.head(list)
      if (matchesPath(path, singleItem)) {
        return singleItem
      }
      // recurse breadth first
      return () => search(path, safeChildren(singleItem))
    }
    // match item in list
    const item = itemByPath(path, list)
    if (t.not(t.isNil(item))) {
      return item
    }
    // recurse breadth first
    return () =>
      search(path, tailItems(list, t.valPipe(list)(t.head, safeChildren)))
  })
)
