import { featureBox as core } from '@z1/lib-feature-box-server-core'
import { apiBox } from '@z1/lib-api-box-nedb'

// main
export const featureBox = Fn(t =>
  t.mergeAll([
    core,
    { api: t.pick(['create', 'compose', 'combine', 'configure'], apiBox) },
    t.pick(['server', 'app', apiBox]),
  ])
)
export const task = Fn
export const fn = Fn
export const fs = Fs