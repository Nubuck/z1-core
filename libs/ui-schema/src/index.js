import fn from '@z1/preset-task'

// main
const renderChildren = fn(t => (ctx, parent, children) => {
  return t.reduce((cx, ff) => ff(cx, parent), ctx, children || [])
})
const item = fn(t => (path = '/', props = {}, children = []) => {
  const hasChildren = t.notZeroLen(children)
  return (ctx, parent) => {
    const nextPath = t.startsWith('~', path)
      ? `/${t.replace(/_/g, '/', parent)}/${t.replace(
          '/',
          '',
          t.replace('~', '', path)
        )}`
      : t.startsWith('/', path)
      ? path
      : `/${path}`
    const pathKey = t.eq(nextPath, '/') ? '_' : t.to.snakeCase(nextPath)
    return t.merge(ctx, {
      [pathKey]: {
        path: nextPath,
        parent,
        props,
        hasChildren,
        children: hasChildren ? renderChildren({}, pathKey, children) : {},
      },
    })
  }
})
const nav = fn(t => factory => {
  const nextSchema = factory(item)
  return t.isType(nextSchema, 'array')
    ? renderChildren({}, 'root', nextSchema)
    : nextSchema({}, 'root')
})

// print example
const demo = nav(n => [
  n('/', { title: 'home' }, [
    n('/about', { title: 'about' }),
    n('/contact', { title: 'contact' }),
    n('/products', { title: 'products' }, [
      n('~/type1', { title: 'type 1' }, [
        n('~/about', { title: 'type 1 about' }),
        n('~/pricing', { title: 'type 1 pricing' }),
      ]),
      n('~/type2', { title: 'type 2' }, [
        n('~/about', { title: 'type 2 about' }),
        n('~/pricing', { title: 'type 2 pricing' }),
        n('~/reviews', { title: 'type 2 reviews' }),
      ]),
    ]),
    n('/specials', { title: 'contact' }, [n('~/latest', { title: 'contact' })]),
  ]),
  n('/partners', { title: 'partners' }, [
    n('~/about', { title: 'partners about' }),
    n('~/contact', { title: 'partners contact' }),
  ]),
])
const print = fn(t => () => {
  console.log('NAV SCHEMA', demo)

  t.forEach(([key, child]) => {
    console.log('SCHEMA Child', key, child)
    if (child.hasChildren) {
      t.forEach(([childKey, grandChild]) => {
        console.log('SCHEMA Child Grandchild', key, childKey, grandChild)
        if (grandChild.hasChildren) {
          console.log(
            'SCHEMA Child Grandchild children',
            key,
            childKey,
            grandChild.children
          )
        }
      }, t.to.pairs(child.children))
    }
  }, t.to.pairs(demo))
})

print()
