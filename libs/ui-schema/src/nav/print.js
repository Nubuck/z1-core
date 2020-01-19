import fn from '@z1/preset-task'
import nav, { findNavItem } from './nav'

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
    n('~/about', { title: 'partners about' }, [
      n('~/team', { title: 'partners about team' }),
    ]),
    n('~/contact', { title: 'partners contact' }),
    n('/sales/customer-care', { title: 'customer care' }),
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

  // const path = '/products/type2/reviews'
  // const path = 'partners/contact/'
  const path = '/sales/customer-care'

  console.log('FIND NAV ITEM', path)
  const found = findNavItem(path, demo)
  console.log('FOUND ITEM', found)
})

print()
