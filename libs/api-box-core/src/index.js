import { FeathersExpress } from '@z1/preset-feathers-server'
import { Fs } from '@z1/preset-tools'
import Fallback from 'express-history-api-fallback'

// quick exports
export { FeathersErrors } from '@z1/preset-feathers-server'

// parts
export const appMiddleware = {
  serve: FeathersExpress.static,
  fallback: Fallback,
}
export const fs = Fs

// main
export { operatorsAliases } from './models'
export { createApiBox, composeApiBox, combineApiBoxes } from './box'
export { createApi } from './api'
export {
  createApiServer,
  runServer,
  reloadServer,
  createAppServer,
  reloadAppServer,
} from './server'
