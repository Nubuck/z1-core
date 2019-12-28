import { fn } from '@z1/lib-feature-box'

// main
export const create = task(t => (name, { state, ui }) => {
  return {
    name: null,
    route: 'detail',
    match: {
      home: null,
      view: null,
      detail: null,
      more: null,
    },
    state: {
      initial: {},
      data() {},
      form() {},
      modal() {},
      async load() {},
      async transmit() {},
      subscribe() {},
    },
    ui: null,
  }
})
