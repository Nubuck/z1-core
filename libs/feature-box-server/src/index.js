import { task as fn } from '@z1/lib-feature-box-server-core'
import { apiBoxCore } from '@z1/lib-api-box-core'
import { withNedbAdapter } from '@z1/lib-api-box-nedb'
import { withSequelizeAdapter } from '@z1/lib-api-box-sql'

export * from '@z1/lib-feature-box-server-core'

// main
export const apiBox = fn(f =>
  f.pipe(withNedbAdapter, withSequelizeAdapter, apiBoxCore)()
)
