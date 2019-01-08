import { task } from '@z1/preset-task'
import { camelKeys, tailHead } from './common'

// nav types
const NAV_SCHEMA = {
  PARENT: 'parent',
  ORIGIN: 'origin',
  ROOT: 'root',
  CHILDREN: 'children',
}

// nav tasks
const cleanRoutePath = task(
  t => routePath => t.equals(t.last(routePath), '/')
    ? t.dropLast(1, routePath)
    : routePath,
)
const cleanSuffix = task(
  t => (suffix) => suffix
    ? t.equals(t.head(suffix), '/')
      ? cleanRoutePath(suffix)
      : `/${cleanRoutePath(suffix)}`
    : '',
)
const toUrl = task(
  t => (routePath, suffix) => (
    t.equals(t.head(routePath), '/')
  )
    ? `${cleanRoutePath(routePath)}${cleanSuffix(suffix)}`
    : `/${cleanRoutePath(routePath)}${cleanSuffix(suffix)}`,
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
      t.forEach(
        element => {
          nextPath = `${nextPath}/${element}`
        },
        path,
      )
      item = t.merge(item, { path: nextPath })
    }
    else {
      item = t.merge(item, {
        path: path !== ''
          ? toUrl(path)
          : originPath,
      })
    }
    // children
    if (children && t.gt(t.length(children), 0)) {
      const nextChildren = t.map(
        child => child(item.path, parentPath),
        children,
      )
      item = t.merge(item, { children: nextChildren })
    }
    // yield mutable item with props
    return t.merge(item, props || {})
  },
)

// exports schema
export const navSchema = task(
  t => factory => t.map(
    item => item(NAV_SCHEMA.ROOT, NAV_SCHEMA.ROOT),
    factory(navItem, NAV_SCHEMA),
  ),
)

// matching tasks
const safeChildren = item => item && hasChildren(item)
  ? item.children
  : []
const matchesPath = task(
  t => (path, item) => {
    return t.not(item)
      ? false
      : t.eq(path, '/')
        ? t.eq(item.path, path)
        : item.path.includes(decodeURI(path))
  },
)
const itemByPath = task(
  t => (path, list) => t.find(
    item => matchesPath(path, item),
    list,
  ),
)
const tailItems = task(
  t => (items, children) => t.concat(
    t.tail(items), children,
  ),
)
export const matchedNavItem = task(
  t => (outerPath, outerList) => {
    const search = (path, list) => {
      // list empty
      if (t.equals(t.length(list), 0)) {
        return undefined
      }
      // list has single item
      if (t.equals(t.length(list), 1)) {
        // match head
        const singleItem = t.head(list)
        if (matchesPath(path, singleItem)) {
          return singleItem
        }
        // recurse breadth first
        return search(path, safeChildren(singleItem))
      }
      // match item in list
      const item = itemByPath(path, list)
      if (item) {
        return item
      }
      // recurse breadth first
      return search(
        path,
        tailItems(
          list,
          t.compose(safeChildren, t.head)(list),
        ),
      )
    }
    return search(outerPath, outerList)
  },
)