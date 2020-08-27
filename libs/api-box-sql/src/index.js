import { apiBoxCore, task as Fn, fs as Fs } from '@roboteur/lib-api-box-core'

// parts
import { withKnexAdapter } from './knex'

// main
const abx = apiBoxCore(withKnexAdapter())
export { withKnexAdapter } from './knex'
export const apiBox = abx
export const task = Fn
export const fn = Fn
export const fs = Fs
export default abx
