import fn from '@z1/preset-task'

// main
const renderChildren = fn(t => (ctx, parent, children) => {
  return t.reduce((cx, ff) => ff(cx, parent), ctx, children || [])
})
const item = fn(t => (path = '/', props = {}, children = []) => {
  const pathKey = t.eq(path, '/') ? '_' : t.to.snakeCase(path)
  const hasChildren = t.notZeroLen(children)
  return (ctx, parent) => {
    return t.merge(ctx, {
      [pathKey]: {
        path,
        parent,
        props,
        hasChildren,
        children: hasChildren ? renderChildren({}, pathKey, children) : {},
      },
    })
  }
})
const nav = fn(t => factory => {
  const navSchema = factory(item)
  return navSchema({}, 'root')
})

// print example
const demo = nav(n =>
  n('/', { title: 'home' }, [
    n('/about', { title: 'about' }),
    n('/contact', { title: 'contact' }),
    n('/products', { title: 'products' }, [
      n('/products/type1', { title: 'type 1' }, [
        n('/products/type1/about', { title: 'type 1 about' }),
        n('/products/type1/pricing', { title: 'type 1 pricing' }),
      ]),
      n('/products/type2', { title: 'type 2' }, [
        n('/products/type2/about', { title: 'type 2 about' }),
        n('/products/type2/pricing', { title: 'type 2 pricing' }),
        n('/products/type2/reviews', { title: 'type 2 reviews' }),
      ]),
    ]),
    n('/specials', { title: 'contact' }, [
      n('/specials/latest', { title: 'contact' }),
    ]),
  ])
)
const print = fn(t => () => {
  console.log('NAV SCHEMA', demo._)

  t.forEach(([key, child]) => {
    console.log('NAV SCHEMA Child', key, child)
    if (child.hasChildren) {
      console.log('NAV SCHEMA Child children', key, child.children)
    }
  }, t.to.pairs(demo._.children))
})

print()
