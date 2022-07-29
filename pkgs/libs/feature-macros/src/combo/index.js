import { state } from './state'
import { ui } from './ui'

// main
export const combo = (cx = [], settings = {}) => {
  return {
    state: state(cx, settings),
    ui: ui(cx, settings),
  }
}
