import { cssToBox, stub, box } from './main'
import { toCss } from '@z1/lib-ui-box-tailwind'

// main
cssToBox(stub)
console.log('BOX OUTPUT', toCss(box))

// hot
if (module.hot) {
  module.hot.accept(['./main'], () => {
    console.log('BOX OUTPUT', toCss(box))
    cssToBox(stub)
  })
}
