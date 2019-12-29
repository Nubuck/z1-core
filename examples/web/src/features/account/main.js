import { featureBox as fbx } from '@z1/lib-feature-box'

// main
export const feature = fbx.create(
  ctx => {
    return {
      name: 'account',
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
