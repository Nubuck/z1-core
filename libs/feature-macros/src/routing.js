import { fn, featureBox } from '@z1/lib-feature-box'

// main
export const routing = fn(t => (state, ui) => {
  return {
    action: featureBox.routing.actions(state),
    ui,
  }
})
