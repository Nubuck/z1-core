import core from '@z1/lib-feature-box-server-core'
import { apiBoxCore, task as Fn, fs as Fs } from '@z1/lib-api-box-core'
import { withNedbAdapter } from '@z1/lib-api-box-nedb'

// main
export const apiBox = Fn(t => t.pipe(withNedbAdapter, apiBoxCore)())
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
export {
  FeathersErrors,
  FeathersAuth,
  FeathersOAuth,
} from '@z1/lib-api-box-core'
export default featureBox
