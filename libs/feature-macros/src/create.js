import { fn } from '@z1/lib-feature-box'

// main
export const create = task(t => (name, { state, ui }) => {
  return {
    key: null,
    match: 'detail',
    state(ctx) {
      return {
        initial: {},
        data() {},
        form() {},
        modal() {},
        subscribe() {},
        async load() {},
        async transmit() {},
      }
    },
    ui(ctx) {
      return null
    },
  }
})
