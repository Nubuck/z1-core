import z from '@z1/lib-feature-box'


// main
const name = 'pages'
export const state = z.fn(t =>
  z.state.create(name, [
    {
      routes(r) {
        return [r('/', 'routeLanding', state => state)]
      },
      onInit(){
        console.log('Pages init')
      }
    },

  ])
)
