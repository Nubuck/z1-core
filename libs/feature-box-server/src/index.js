import core from '@z1/lib-feature-box-server-core'
import { apiBoxCore, task as Fn, fs as Fs } from '@z1/lib-api-box-core'
import { withNedbAdapter } from '@z1/lib-api-box-nedb'
import { withSequelizeAdapter } from '@z1/lib-api-box-sql'

// main
export const apiBox = Fn(t =>
  t.pipe(withNedbAdapter, withSequelizeAdapter, apiBoxCore)()
)
export const featureBox = Fn(t =>
  t.mergeAll([
    core,
    { api: t.pick(['create', 'combine', 'configure'], apiBox) },
    t.pick(['server', 'app'], apiBox),
  ])
)
export const task = Fn
export const fn = Fn
export const fs = Fs
export { FeathersErrors } from '@z1/lib-api-box-core'
export default featureBox
