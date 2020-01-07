import { task } from '@z1/preset-task'
import { uiBox as ubx } from './main'

// outs
export const uiBox = { create: ubx, toCss }
export { toCss } from './toCss'
export const fn = task
export default uiBox
