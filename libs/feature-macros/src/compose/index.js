import { state } from './state'
import { ui } from './ui'

// main
export const comboView = (cx = [], settings = {}) => {
  return {
    state: state(cx, settings),
    ui: ui(cx, settings),
  }
}
