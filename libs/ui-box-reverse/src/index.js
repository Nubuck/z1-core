import { cssToBox, stub } from './main'

// console.log('BOX OUTPUT', cssToBox(stub))
cssToBox(stub)

if (module.hot) {
  module.hot.accept(['./main'], () => {
    // console.log('BOX OUTPUT', cssToBox(stub))
    cssToBox(stub)
  })
}
