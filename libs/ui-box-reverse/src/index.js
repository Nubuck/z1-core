import { cssToBox, stub, box } from './main'
import { toCss } from '@z1/lib-ui-box-tailwind'

// main
console.log('CSS OUTPUT', cssToBox(stub).borderRadius)
console.log('BOX OUTPUT', toCss(box))

// hot
if (module.hot) {
  module.hot.accept(['./main'], () => {
    console.log('CSS OUTPUT', cssToBox(stub).borderRadius)
    console.log('BOX OUTPUT', toCss(box))
  })
}
