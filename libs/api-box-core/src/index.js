import { Fs } from '@z1/preset-tools'
import Fallback from 'express-history-api-fallback'

// quick exports
export { FeathersErrors } from '@z1/preset-feathers-server-core'

// parts
export const appMiddleware = {
  serve: FeathersExpress.static,
  fallback: Fallback,
}
export const fs = Fs

// main
export * from './api'
export * from './box'
export * from './server'
export * from './services'
