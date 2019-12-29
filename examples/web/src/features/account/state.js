import { featureBox as fbx } from '@z1/lib-feature-box'

// main
export const state = fbx.state.create({
  name: 'account',
  intial: {},
  mutations(m) {
    return []
  },
  routes(r) {
    return []
  },
  guards(g, { actions, mutators }) {
    return []
  },
  effects(fx, { actions, mutators }) {
    return []
  },
})
