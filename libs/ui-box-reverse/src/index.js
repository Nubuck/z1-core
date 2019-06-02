import { cssToBox } from './main'

// const stub =
//   'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
// const stub =
//   'inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2'
const stub =
  'h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden'

console.log('BOX OUTPUT', cssToBox(stub))

if (module.hot) {
  module.hot.accept(['./main'], () => {
    console.log('BOX OUTPUT', cssToBox(stub))
  })
}
