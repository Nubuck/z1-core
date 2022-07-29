import { task } from '@z1/preset-task'
import { uiBox as ubx } from './main'
import { cssProps } from './cssProps'
import { toCss } from './toCss'

// outs
export const uiBox = task(t => ({ create: ubx, toCss, keys: t.keys(cssProps) }))
export { toCss } from './toCss'
export const fn = task
export default uiBox
