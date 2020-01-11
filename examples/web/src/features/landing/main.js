import zbx from '@z1/lib-feature-box'

// main
export const feature = zbx.create(
  'account',
  ctx => {
    return {
      state: [],
      ui: {},
      parts: {},
      routing: [
        {
          action: [],
          ui: null,
        },
      ],
    }
  },
  { ui: null }
)
